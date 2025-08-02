const { Router } = require("express");
const {
  UploadController,
} = require("../../controllers/upload/upload.controller.js");
const {
  uploadFileWithMulter,
} = require("../../middlewares/upload/upload.middleware.js");
const { authMiddleware } = require("../../middlewares/auth/auth.middleware.js");
const { roleMiddleware } = require("../../middlewares/role/role.middleware.js");
const { RoleConstants } = require("../../utils/constants/constants.js");

const uploadRouter = Router();

uploadRouter.post(
  "/",
  authMiddleware,
  roleMiddleware([RoleConstants.ADMIN, RoleConstants.CEO]),
  uploadFileWithMulter.single("file"),
  UploadController.uploadFile
);

module.exports = { uploadRouter };
