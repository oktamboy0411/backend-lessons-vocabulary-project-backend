const { Router } = require("express");
const {
  AdminController,
} = require("../../controllers/admin/admin.controller.js");
const { AdminValidator } = require("../../validators/admin/admin.validator.js");
const { expressValidatorMiddleware } = require("../../validators/index.js");
const { authMiddleware } = require("../../middlewares/auth/auth.middleware.js");
const { roleMiddleware } = require("../../middlewares/role/role.middleware.js");
const { RoleConstants } = require("../../utils/constants/constants.js");

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

AdminRouter.get(
  "/profile",
  authMiddleware,
  roleMiddleware([RoleConstants.ADMIN, RoleConstants.CEO]),
  AdminController.getProfile
);

module.exports = { AdminRouter };
