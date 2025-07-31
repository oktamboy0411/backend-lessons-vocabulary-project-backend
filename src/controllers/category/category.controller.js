const { CollectionConstants } = require("../../utils/constants/constants.js");
const { StatusCodes } = require("http-status-codes");
const {
  HttpException,
} = require("../../utils/http-exception/http-exception.js");
const { SectionModel } = require("../../models/section/section.model.js");
const { CategoryModel } = require("../../models/category/category.model.js");
const {
  VocabularyModel,
} = require("../../models/vocabulary/vocabulary.model.js");

class CategoryController {
  static create = async (req, res) => {
    const { name, vocabulary, section } = req.body;

    const existingVocabulary = await VocabularyModel.findById(vocabulary);
    if (!existingVocabulary) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Vocabulary not found!");
    }

    const existingSection = await SectionModel.findById(section);
    if (!existingSection) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Section not found!");
    }
    if (existingSection.vocabulary.toString() !== vocabulary) {
      throw new HttpException(
        StatusCodes.NOT_FOUND,
        "This section does not exist in the specified vocabulary."
      );
    }

    const existingName = await CategoryModel.findOne({ name, section });
    if (existingName) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        "Category with this name already exists in the section."
      );
    }

    await CategoryModel.create({
      name,
      section,
      vocabulary,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Category created successfully",
    });
  };

  static getAll = async (req, res) => {
    const { search, vocabulary } = req.query;
  };
}

module.exports = { CategoryController };
