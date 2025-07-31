const { body, query, param } = require("express-validator");

class CategoryValidator {
  static create = () => [
    body("name", "Name is required.").notEmpty(),
    body("name", "Name must be a string.").isString(),
    body("section", "Section is required.").notEmpty(),
    body("section", "Section must be a valid Mongo ID.").isMongoId(),
    body("vocabulary", "Vocabulary is required.").notEmpty(),
    body("vocabulary", "Vocabulary must be a valid Mongo ID.").isMongoId(),
  ];
}

module.exports = { CategoryValidator };
