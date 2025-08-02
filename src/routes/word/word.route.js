const { Router } = require("express");
const { expressValidatorMiddleware } = require("../../validators/index.js");
const { WordController } = require("../../controllers/word/word.controller.js");
const { WordValidator } = require("../../validators/word/word.validator.js");
const { authMiddleware } = require("../../middlewares/auth/auth.middleware.js");
const { roleMiddleware } = require("../../middlewares/role/role.middleware.js");
const { RoleConstants } = require("../../utils/constants/constants.js");

const WordRouter = Router();

WordRouter.post(
  "/create",
  authMiddleware,
  roleMiddleware([RoleConstants.ADMIN, RoleConstants.CEO]),
  WordValidator.create(),
  expressValidatorMiddleware,
  WordController.create
);

WordRouter.get(
  "/get-all",
  WordValidator.getAll(),
  expressValidatorMiddleware,
  WordController.getAll
);

WordRouter.get(
  "/get/:id",
  WordValidator.getOne(),
  expressValidatorMiddleware,
  WordController.getOne
);

WordRouter.delete(
  "/delete/:id",
  authMiddleware,
  roleMiddleware([RoleConstants.ADMIN, RoleConstants.CEO]),
  WordValidator.delete(),
  expressValidatorMiddleware,
  WordController.delete
);

WordRouter.put(
  "/update/:id",
  authMiddleware,
  roleMiddleware([RoleConstants.ADMIN, RoleConstants.CEO]),
  WordValidator.update(),
  expressValidatorMiddleware,
  WordController.update
);

module.exports = { WordRouter };
