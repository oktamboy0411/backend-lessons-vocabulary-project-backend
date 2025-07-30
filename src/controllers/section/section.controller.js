const {
  HttpException,
} = require("../../utils/http-exception/http-exception.js");
const { SectionModel } = require("../../models/section/section.model.js");
const { StatusCodes } = require("http-status-codes");
const { UploadModel } = require("../../models/upload/upload.model.js");
const {
  VocabularyModel,
} = require("../../models/vocabulary/vocabulary.model.js");
const { CollectionConstants } = require("../../utils/constants/constants.js");

class SectionController {
  static create = async (req, res) => {
    const { name, vocabulary, image } = req.body;

    const findVocabulary = await VocabularyModel.findById(vocabulary);
    if (!findVocabulary) {
      throw new HttpException(StatusCodes.BAD_REQUEST, "Vocabulary not found.");
    }

    const existingNameInVocabulary = await SectionModel.findOne({
      name,
      vocabulary,
    });
    if (existingNameInVocabulary) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        "Section with this name already exists in the vocabulary."
      );
    }

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

    await SectionModel.create({
      name,
      vocabulary,
      image,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Section created successfully.",
    });

    await savedImage.updateOne({
      $set: { is_use: true, where_used: CollectionConstants.SECTION },
    });
  };

  static getAll = async (req, res) => {
    const { search, vocabulary } = req.query;

    const searchQuery = {};

    if (vocabulary) {
      searchQuery.vocabulary = vocabulary;
    }

    if (search && search.trim().length > 0) {
      searchQuery.$or = [{ name: { $regex: search.trim(), $options: "i" } }];
    }

    const sections = await SectionModel.find(searchQuery).populate(
      "vocabulary",
      ["name", "type"]
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: sections,
    });
  };

  static delete = async (req, res) => {
    const { id } = req.params;

    const section = await SectionModel.findById(id);
    if (!section) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Section not found.");
    }

    await section.deleteOne();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Section deleted successfully.",
    });

    await UploadModel.updateOne(
      { file_path: section.image },
      { $set: { is_use: false, where_used: "" } }
    );
  };

  static update = async (req, res) => {
    const { id } = req.params;
    const { name, image } = req.body;

    const section = await SectionModel.findById(id);
    if (!section) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Section not found.");
    }

    const updatedSection = {};

    if (name && name !== section.name) {
      const existingNameInVocabulary = await SectionModel.findOne({
        name,
        vocabulary: section.vocabulary,
      });
      if (existingNameInVocabulary) {
        throw new HttpException(
          StatusCodes.BAD_REQUEST,
          "Section with this name already exists in the vocabulary."
        );
      }
      updatedSection.name = name;
    }

    if (image && image !== section.image) {
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
      updatedSection.image = image;
    }

    await section.updateOne(updatedSection);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Section updated successfully.",
    });

    if (image && image !== section.image) {
      await UploadModel.updateOne(
        { file_path: section.image },
        { $set: { is_use: false, where_used: "" } }
      );
      await UploadModel.updateOne(
        { file_path: image },
        { $set: { is_use: true, where_used: CollectionConstants.SECTION } }
      );
    }
  };
}

module.exports = { SectionController };
