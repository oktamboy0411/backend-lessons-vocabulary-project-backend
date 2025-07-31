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
    const { search, vocabulary, section, page, limit } = req.query;

    const searchQuery = {};

    if (section) {
      searchQuery.section = section;
    }

    if (vocabulary) {
      searchQuery.vocabulary = vocabulary;
    }

    if (search && search.trim().length > 0) {
      searchQuery.$or = [{ name: { $regex: search.trim(), $options: "i" } }];
    }

    const categories = await CategoryModel.find(searchQuery)
      .populate([
        { path: "vocabulary", select: "name type" },
        { path: "section", select: "name" },
      ])
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await CategoryModel.countDocuments(searchQuery);

    res.status(StatusCodes.OK).json({
      success: true,
      data: categories,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalPage: Math.ceil(total / limit),
        hasNextPage: (page - 1) * limit + categories.length < total,
        hasPrevPage: page > 1,
      },
    });
  };

  static delete = async (req, res) => {
    const { id } = req.params;

    const category = await CategoryModel.findById(id);
    if (!category) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Category not found.");
    }

    await category.deleteOne();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Category deleted successfully.",
    });
  };

  static update = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    const category = await CategoryModel.findById(id);
    if (!category) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Category not faound!");
    }

    const updatedCategory = {};

    if (name && name !== category.name) {
      const existingNameInSection = await CategoryModel.findOne({
        name,
        section: category.section,
      });
      if (existingNameInSection) {
        throw new HttpException(
          StatusCodes.BAD_REQUEST,
          "Category with this name already exists in the section."
        );
      }
      updatedCategory.name = name;
    }

    await category.updateOne(updatedCategory);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Category updated successfully.",
    });
  };
}

module.exports = { CategoryController };
