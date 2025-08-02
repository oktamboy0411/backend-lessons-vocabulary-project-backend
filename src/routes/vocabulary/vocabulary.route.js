const { Router } = require("express");
const {
  VocabularyController,
} = require("../../controllers/vocabulary/vocabulary.controller.js");
const { expressValidatorMiddleware } = require("../../validators/index.js");
const {
  VocabularyValidator,
} = require("../../validators/vocabulary/vocabulary.validator.js");
const { authMiddleware } = require("../../middlewares/auth/auth.middleware.js");
const { roleMiddleware } = require("../../middlewares/role/role.middleware.js");
const { RoleConstants } = require("../../utils/constants/constants.js");

const VocabularyRouter = Router();

VocabularyRouter.post(
  "/create",
  authMiddleware,
  roleMiddleware([RoleConstants.ADMIN, RoleConstants.CEO]),
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

VocabularyRouter.delete(
  "/delete/:id",
  authMiddleware,
  roleMiddleware([RoleConstants.ADMIN, RoleConstants.CEO]),
  VocabularyValidator.delete(),
  expressValidatorMiddleware,
  VocabularyController.delete
);

VocabularyRouter.put(
  "/update/:id",
  authMiddleware,
  roleMiddleware([RoleConstants.ADMIN, RoleConstants.CEO]),
  VocabularyValidator.update(),
  expressValidatorMiddleware,
  VocabularyController.update
);

module.exports = { VocabularyRouter };
