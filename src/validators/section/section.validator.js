const { body, query, param } = require("express-validator");

class SectionValidator {
  static create = () => [
    body("name", "Name is required.").notEmpty(),
    body("name", "Name must be a string.").isString(),
    body("vocabulary", "Vocabulary ID is required.").notEmpty(),
    body(
      "vocabulary",
      "Vocabulary ID must be a valid MongoDB ObjectId."
    ).isMongoId(),
    body("image", "Image is required.").notEmpty(),
    body("image", "Image must be a valid URL.").isURL(),
  ];

  static getAll = () => [
    query("search", "Search must be a string.").optional().isString(),
    query("vocabulary", "Vocabulary ID must be a valid MongoDB ObjectId.")
      .optional()
      .isMongoId(),
    query("page", "Page must be a positive integer.")
      .optional()
      .isInt({ min: 1 }),
    query("limit", "Limit must be a positive integer.")
      .optional()
      .isInt({ min: 1 }),
  ];

  static delete = () => [
    param("id", "Section ID must be a valid MongoDB ObjectId.").isMongoId(),
  ];

  static update = () => [
    param("id", "Section ID must be a valid MongoDB ObjectId.").isMongoId(),
    body("name", "Name must be a string.").optional().isString(),
    body("image", "Image must be a valid URL.").optional().isURL(),
  ];
}

module.exports = { SectionValidator };
