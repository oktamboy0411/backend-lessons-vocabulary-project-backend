const { body, query, param } = require("express-validator");

class WordValidator {
  static create = () => [
    body("name", "Name is required.").notEmpty(),
    body("name", "Name must be a string.").isString(),
    body("description", "Description is required.").notEmpty(),
    body("description", "Description must be a string.").isString(),
    body("image", "Image must be a string URL.").optional().isURL(),
    body("category", "Category is required.").notEmpty(),
    body("category", "Category must be a valid Mongo ID.").isMongoId(),
    body("section", "Section is required.").notEmpty(),
    body("section", "Section must be a valid Mongo ID.").isMongoId(),
    body("vocabulary", "Vocabulary is required.").notEmpty(),
    body("vocabulary", "Vocabulary must be a valid Mongo ID.").isMongoId(),
  ];

  static getAll = () => [
    query("search", "Search must be a string.").optional().isString(),
    query("vocabulary", "Vocabulary ID must be a valid MongoDB ObjectId.")
      .optional()
      .isMongoId(),
    query("section", "Section ID must be a valid MongoDB ObjectId.")
      .optional()
      .isMongoId(),
    query("category", "Category ID must be a valid MongoDB ObjectId.")
      .optional()
      .isMongoId(),
    query("page", "Page must be a positive integer.")
      .optional()
      .isInt({ min: 1 }),
    query("limit", "Limit must be a positive integer.")
      .optional()
      .isInt({ min: 1 }),
  ];
}

module.exports = { WordValidator };
