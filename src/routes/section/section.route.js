const { Router } = require("express");
const {
  SectionController,
} = require("../../controllers/section/section.controller.js");
const { expressValidatorMiddleware } = require("../../validators/index.js");
const {
  SectionValidator,
} = require("../../validators/section/section.validator.js");

const SectionRouter = Router();

SectionRouter.post(
  "/create",
  SectionValidator.create(),
  expressValidatorMiddleware,
  SectionController.create
);

SectionRouter.get(
  "/get-all",
  SectionValidator.getAll(),
  expressValidatorMiddleware,
  SectionController.getAll
);

SectionRouter.delete(
  "/delete/:id",
  SectionValidator.delete(),
  expressValidatorMiddleware,
  SectionController.delete
);

SectionRouter.put(
  "/update/:id",
  SectionValidator.update(),
  expressValidatorMiddleware,
  SectionController.update
);

module.exports = { SectionRouter };
