const {
  VocabularyModel,
} = require("../../models/vocabulary/vocabulary.model.js");
const {
  HttpException,
} = require("../../utils/http-exception/http-exception.js");
const { StatusCodes } = require("http-status-codes");
const { UploadModel } = require("../../models/upload/upload.model.js");
const { CollectionConstants } = require("../../utils/constants/constants.js");

class VocabularyController {
  static create = async (req, res) => {
    const { type, name, description, image } = req.body;

    const existingName = await VocabularyModel.findOne({ name });
    if (existingName) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        "Vocabulary with this name already exists."
      );
    }

    if (image) {
      const savedImage = await UploadModel.findOne({ file_path: image });
      if (!savedImage) {
        throw new HttpException(StatusCodes.BAD_REQUEST, "Image not found.");
      }

      if (savedImage.is_use) {
        throw new HttpException(
          StatusCodes.BAD_REQUEST,
          "Image is already in use: " + savedImage.where_used
        );
      }
    }

    await VocabularyModel.create({
      type,
      name,
      description,
      image,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Vocabulary created successfully.",
    });

    if (image) {
      await UploadModel.updateOne(
        { file_path: image },
        { $set: { is_use: true, where_used: CollectionConstants.VOCABULARY } }
      );
    }
  };

  static getAll = async (req, res) => {
    const { search, type } = req.query;

    const searchQuery = {};

    if (type) {
      searchQuery.type = type;
    }

    if (search && search.trim().length > 0) {
      searchQuery.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const vocabularies = await VocabularyModel.find(searchQuery);

    res.status(StatusCodes.OK).json({
      success: true,
      data: vocabularies,
    });
  };

  static delete = async (req, res) => {
    const { id } = req.params;

    const vocabularyDelete = await VocabularyModel.findById(id);
    if (!vocabularyDelete) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Vocabulary not found.");
    }
    await vocabularyDelete.deleteOne();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Vocabulary deleted successfully.",
    });

    if (vocabularyDelete.image) {
      await UploadModel.updateOne(
        { file_path: vocabularyDelete.image },
        { $set: { is_use: false, where_used: "" } }
      );
    }
  };

  static update = async (req, res) => {
    const { id } = req.params;
    const { type, name, description, image } = req.body;

    const vocabularyUpdate = await VocabularyModel.findById(id);
    if (!vocabularyUpdate) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Vocabulary not found.");
    }

    const updateObject = {};

    if (type && type !== vocabularyUpdate.type) {
      updateObject.type = type;
    }

    if (name && name !== vocabularyUpdate.name) {
      const existingName = await VocabularyModel.findOne({ name });
      if (existingName) {
        throw new HttpException(
          StatusCodes.BAD_REQUEST,
          "Vocabulary with this name already exists."
        );
      }
      updateObject.name = name;
    }

    if (description && description !== vocabularyUpdate.description) {
      updateObject.description = description;
    }

    if (image && image !== vocabularyUpdate.image) {
      const savedImage = await UploadModel.findOne({ file_path: image });
      if (!savedImage) {
        throw new HttpException(StatusCodes.BAD_REQUEST, "Image not found.");
      }

      if (savedImage.is_use) {
        throw new HttpException(
          StatusCodes.BAD_REQUEST,
          "Image is already in use: " + savedImage.where_used
        );
      }
      updateObject.image = image;
    }

    await VocabularyModel.findByIdAndUpdate(id, updateObject);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Vocabulary updated successfully.",
    });

    if (image && image !== vocabularyUpdate.image) {
      await UploadModel.updateOne(
        { file_path: image },
        { $set: { is_use: true, where_used: CollectionConstants.VOCABULARY } }
      );
      await UploadModel.updateOne(
        { file_path: vocabularyUpdate.image },
        { $set: { is_use: false, where_used: "" } }
      );
    }
  };
}
module.exports = { VocabularyController };
