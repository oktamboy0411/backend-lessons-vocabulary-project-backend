const { Router } = require("express");
const {
  VocabularyController,
} = require("../../controllers/vocabulary/vocabulary.controller.js");
const { expressValidatorMiddleware } = require("../../validators/index.js");
const {
  VocabularyValidator,
} = require("../../validators/vocabulary/vocabulary.validator.js");

const VocabularyRouter = Router();

VocabularyRouter.post(
  "/create",
  VocabularyValidator.create(),
  expressValidatorMiddleware,
  VocabularyController.create
);

VocabularyRouter.get(
  "/get-all",
  VocabularyValidator.getAll(),
  expressValidatorMiddleware,
  VocabularyController.getAll
);

module.exports = { VocabularyRouter };
