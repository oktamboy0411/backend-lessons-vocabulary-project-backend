const { body, query, param } = require("express-validator");
const { VocabularyTypes } = require("../../utils/constants/constants");

class VocabularyValidator {
  static create = () => [
    body("name", "Name is required.").notEmpty(),
    body("name", "Name must be a string.").isString(),
    body("type", "Type is required.").notEmpty(),
    body(
      "type",
      "Type must be one of the following: " +
        Object.values(VocabularyTypes).join(", ")
    ).isIn([VocabularyTypes.MODERN, VocabularyTypes.HISTORY]),
    body("description", "Description must be a string.").optional().isString(),
    body("image", "Image must be a string.").optional().isURL(),
  ];

  static getAll = () => [
    query("search", "Search must be a string.").optional().isString(),
    query(
      "type",
      "Type must be one of the following: " +
        Object.values(VocabularyTypes).join(", ")
    )
      .optional()
      .isIn([VocabularyTypes.MODERN, VocabularyTypes.HISTORY]),
  ];

  static delete = () => [
    param("id", "ID must be a valid MongoDB ObjectId.").isMongoId(),
  ];

  static update = () => [
    param("id", "ID must be a valid MongoDB ObjectId.").isMongoId(),
    body("name", "Name must be a string.").optional().isString(),
    body(
      "type",
      "Type must be one of the following: " +
        Object.values(VocabularyTypes).join(", ")
    )
      .optional()
      .isIn([VocabularyTypes.MODERN, VocabularyTypes.HISTORY]),
    body("description", "Description must be a string.").optional().isString(),
    body("image", "Image must be a string.").optional().isURL(),
  ];
}

module.exports = { VocabularyValidator };
