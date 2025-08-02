const { Router } = require("express");
const {
  SectionController,
} = require("../../controllers/section/section.controller.js");
const { expressValidatorMiddleware } = require("../../validators/index.js");
const {
  SectionValidator,
} = require("../../validators/section/section.validator.js");
const { authMiddleware } = require("../../middlewares/auth/auth.middleware.js");
const { roleMiddleware } = require("../../middlewares/role/role.middleware.js");
const { RoleConstants } = require("../../utils/constants/constants.js");

const SectionRouter = Router();

SectionRouter.post(
  "/create",
  authMiddleware,
  roleMiddleware([RoleConstants.ADMIN, RoleConstants.CEO]),
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

SectionRouter.get(
  "/get-one/:id",
  SectionValidator.delete(),
  expressValidatorMiddleware,
  SectionController.getOne
);

SectionRouter.delete(
  "/delete/:id",
  authMiddleware,
  roleMiddleware([RoleConstants.ADMIN, RoleConstants.CEO]),
  SectionValidator.delete(),
  expressValidatorMiddleware,
  SectionController.delete
);

SectionRouter.put(
  "/update/:id",
  authMiddleware,
  roleMiddleware([RoleConstants.ADMIN, RoleConstants.CEO]),
  SectionValidator.update(),
  expressValidatorMiddleware,
  SectionController.update
);

module.exports = { SectionRouter };
