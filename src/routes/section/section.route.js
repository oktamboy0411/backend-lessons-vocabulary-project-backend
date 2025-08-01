const { Router } = require("express");
const {
  SectionController,
} = require("../../controllers/section/section.controller.js");
const { expressValidatorMiddleware } = require("../../validators/index.js");
const {
  SectionValidator,
} = require("../../validators/section/section.validator.js");
const { authMiddleware } = require("../../middlewares/auth/auth.middleware.js");

const SectionRouter = Router();

SectionRouter.post(
  "/create",
  authMiddleware,
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
  authMiddleware,
  SectionValidator.delete(),
  expressValidatorMiddleware,
  SectionController.delete
);

SectionRouter.put(
  "/update/:id",
  authMiddleware,
  SectionValidator.update(),
  expressValidatorMiddleware,
  SectionController.update
);

module.exports = { SectionRouter };
