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

    let searchQuery = {};

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
}
module.exports = { VocabularyController };
