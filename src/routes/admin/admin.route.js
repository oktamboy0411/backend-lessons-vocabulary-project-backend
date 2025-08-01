const { Router } = require("express");
const {
  AdminController,
} = require("../../controllers/admin/admin.controller.js");
const { AdminValidator } = require("../../validators/admin/admin.validator.js");
const { expressValidatorMiddleware } = require("../../validators/index.js");

const AdminRouter = Router();

AdminRouter.post(
  "/sign-up",
  AdminValidator.signUp(),
  expressValidatorMiddleware,
  AdminController.signUp
);

AdminRouter.post(
  "/login",
  AdminValidator.login(),
  expressValidatorMiddleware,
  AdminController.login
);

module.exports = { AdminRouter };
