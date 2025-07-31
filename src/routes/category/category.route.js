const { Router } = require("express");
const { expressValidatorMiddleware } = require("../../validators/index.js");
const {
  CategoryController,
} = require("../../controllers/category/category.controller.js");
const {
  CategoryValidator,
} = require("../../validators/category/category.validator.js");

const CategoryRouter = Router();

CategoryRouter.post(
  "/create",
  CategoryValidator.create(),
  expressValidatorMiddleware,
  CategoryController.create
);

CategoryRouter.get(
  "/get-all",
  CategoryValidator.getAll(),
  expressValidatorMiddleware,
  CategoryController.getAll
);

CategoryRouter.delete(
  "/delete/:id",
  CategoryValidator.delete(),
  expressValidatorMiddleware,
  CategoryController.delete
);

CategoryRouter.put(
  "/update/:id",
  CategoryValidator.update(),
  expressValidatorMiddleware,
  CategoryController.update
);

module.exports = { CategoryRouter };
