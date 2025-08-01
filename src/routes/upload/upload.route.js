const { Router } = require("express");
const {
  UploadController,
} = require("../../controllers/upload/upload.controller.js");
const {
  uploadFileWithMulter,
} = require("../../middlewares/upload/upload.middleware.js");
const { authMiddleware } = require("../../middlewares/auth/auth.middleware.js");

const uploadRouter = Router();

uploadRouter.post(
  "/",
  authMiddleware,
  uploadFileWithMulter.single("file"),
  UploadController.uploadFile
);

module.exports = { uploadRouter };
