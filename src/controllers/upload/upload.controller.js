const { StatusCodes } = require("http-status-codes");
const { v4 } = require("uuid");
const path = require("path");
const {
  HttpException,
} = require("../../utils/http-exception/http-exception.js");
const { uploadFileToS3, deleteFileFromS3 } = require("../../utils/s3/s3.js");
const { UploadModel } = require("../../models/upload/upload.model.js");

class UploadController {
  static uploadFile = async (req, res) => {
    const file = req.file;
    if (!file) {
      throw new HttpException(StatusCodes.BAD_REQUEST, "File is required");
    }

    let file_name = v4() + path.extname(file.originalname);

    if (file.mimetype.startsWith("image/")) {
      file_name = `images/` + file_name;
    }
    if (file.mimetype.startsWith("video/")) {
      file_name = `videos/` + file_name;
    }
    if (file.mimetype.startsWith("audio/")) {
      file_name = `audios/` + file_name;
    }

    const file_path = await uploadFileToS3(
      file_name,
      file.buffer,
      file.mimetype
    );
    if (!file_path) {
      throw new HttpException(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to upload file"
      );
    }

    UploadModel.create({
      file_path,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      file_path,
    });
  };

  static deleteFile = async (file_path) => {
    if (!file_path) {
      return;
    }
    try {
      await UploadModel.deleteOne({ file_path });
      await deleteFileFromS3(file_path);
    } catch (error) {
      throw new HttpException(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to delete file"
      );
    }
  };
}

module.exports = { UploadController };
