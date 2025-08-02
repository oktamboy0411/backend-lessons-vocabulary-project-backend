const { Router } = require("express");
const { expressValidatorMiddleware } = require("../../validators/index.js");
const {
  CategoryController,
} = require("../../controllers/category/category.controller.js");
const {
  CategoryValidator,
} = require("../../validators/category/category.validator.js");
const { authMiddleware } = require("../../middlewares/auth/auth.middleware.js");
const { roleMiddleware } = require("../../middlewares/role/role.middleware.js");
const { RoleConstants } = require("../../utils/constants/constants.js");

const CategoryRouter = Router();

CategoryRouter.post(
  "/create",
  authMiddleware,
  roleMiddleware([RoleConstants.ADMIN, RoleConstants.CEO]),
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
  authMiddleware,
  roleMiddleware([RoleConstants.ADMIN, RoleConstants.CEO]),
  CategoryValidator.delete(),
  expressValidatorMiddleware,
  CategoryController.delete
);

CategoryRouter.put(
  "/update/:id",
  authMiddleware,
  roleMiddleware([RoleConstants.ADMIN, RoleConstants.CEO]),
  CategoryValidator.update(),
  expressValidatorMiddleware,
  CategoryController.update
);

module.exports = { CategoryRouter };
