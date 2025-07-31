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

module.exports = { CategoryRouter };
