const multer = require("multer");
const path = require("path");
const {
  HttpException,
} = require("../../utils/http-exception/http-exception.js");
const { StatusCodes } = require("http-status-codes");

const checkFileType = (file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(
    new HttpException(
      StatusCodes.BAD_REQUEST,
      "Unsupported file type: " + fileTypes
    ),
    false
  );
};

const uploadFileWithMulter = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 50 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

module.exports = { uploadFileWithMulter };
