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

class WordController {
  static create = async (req, res) => {
    const { name, description, image, category, section, vocabulary } =
      req.body;
  };
}

module.exports = { WordController };
