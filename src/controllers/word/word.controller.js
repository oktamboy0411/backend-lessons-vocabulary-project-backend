const {
  HttpException,
} = require("../../utils/http-exception/http-exception.js");
const { StatusCodes } = require("http-status-codes");
const { SectionModel } = require("../../models/section/section.model.js");
const { WordModel } = require("../../models/word/word.model.js");
const { UploadModel } = require("../../models/upload/upload.model.js");
const {
  VocabularyModel,
} = require("../../models/vocabulary/vocabulary.model.js");
const { CategoryModel } = require("../../models/category/category.model.js");
const { CollectionConstants } = require("../../utils/constants/constants.js");

class WordController {
  static create = async (req, res) => {
    const { name, description, image, category, section, vocabulary } =
      req.body;

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

    const existingCategory = await CategoryModel.findById(category);
    if (!existingCategory) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Category not found!");
    }
    if (existingCategory.section.toString() !== section) {
      throw new HttpException(
        StatusCodes.NOT_FOUND,
        "This category does not exist in the specified section."
      );
    }

    const existingName = await WordModel.findOne({ name, category });
    if (existingName) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        "Word with this name already exists in the specified category, section, and vocabulary."
      );
    }

    if (image) {
      const savedImage = await UploadModel.findOne({ file_path: image });
      if (!savedImage) {
        throw new HttpException(StatusCodes.NOT_FOUND, "Image not found.");
      }
      if (savedImage.is_use) {
        throw new HttpException(
          StatusCodes.BAD_REQUEST,
          "Image is already in use: " + savedImage.where_used
        );
      }
    }

    await WordModel.create({
      name,
      description,
      image,
      category,
      section,
      vocabulary,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Word created successfully.",
    });

    if (image) {
      await UploadModel.updateOne(
        { file_path: image },
        { $set: { is_use: true, where_used: CollectionConstants.WORD } }
      );
    }
  };

  static getAll = async (req, res) => {
    const { search, vocabulary, section, category, page, limit } = req.query;

    const searchQuery = {};

    if (category) {
      searchQuery.category = category;
    }

    if (section) {
      searchQuery.section = section;
    }

    if (vocabulary) {
      searchQuery.vocabulary = vocabulary;
    }

    if (search && search.trim().length > 0) {
      searchQuery.$or = [{ name: { $regex: search.trim(), $options: "i" } }];
    }

    const words = await WordModel.find(searchQuery)
      .populate([
        { path: "vocabulary", select: "name type" },
        { path: "section", select: "name" },
        { path: "category", select: "name" },
      ])
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await WordModel.countDocuments(searchQuery);

    res.status(StatusCodes.OK).json({
      success: true,
      data: words,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalPage: Math.ceil(total / limit),
        hasNextPage: (page - 1) * limit + words.length < total,
        hasPrevPage: page > 1,
      },
    });
  };

  static getOne = async (req, res) => {
    const { id } = req.params;
    const word = await WordModel.findById(id).populate([
      { path: "vocabulary", select: "name type" },
      { path: "section", select: "name" },
      { path: "category", select: "name" },
    ]);

    if (!word) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Word not found!");
    }

    res.status(StatusCodes.OK).json({ success: true, data: word });
  };

  static delete = async (req, res) => {
    const { id } = req.params;

    const word = await WordModel.findById(id);
    if (!word) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Word not found.");
    }

    await word.deleteOne();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Word deleted successfully.",
    });

    if (word.image) {
      await UploadModel.updateOne(
        { file_path: word.image },
        { $set: { is_use: false, where_used: "" } }
      );
    }
  };

  static update = async (req, res) => {
    const { id } = req.params;
    const { name, description, image } = req.body;

    const wordUpdate = await WordModel.findById(id);
    if (!wordUpdate) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Word not found.");
    }

    const updateObject = {};

    if (name && name !== wordUpdate.name) {
      const existingName = await WordModel.findOne({
        name,
        category: wordUpdate.category,
      });
      if (existingName) {
        throw new HttpException(
          StatusCodes.BAD_REQUEST,
          "Word with this name already exists in category"
        );
      }
      updateObject.name = name;
    }

    if (description && description !== wordUpdate.description) {
      updateObject.description = description;
    }

    if (image && image !== wordUpdate.image) {
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

    await WordModel.findByIdAndUpdate(id, updateObject);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Word updated successfully.",
    });

    if (image && image !== wordUpdate.image) {
      await UploadModel.updateOne(
        { file_path: image },
        { $set: { is_use: true, where_used: CollectionConstants.WORD } }
      );
      await UploadModel.updateOne(
        { file_path: wordUpdate.image },
        { $set: { is_use: false, where_used: "" } }
      );
    }
  };
}

module.exports = { WordController };
