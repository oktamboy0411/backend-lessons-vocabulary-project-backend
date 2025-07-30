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

  static deleteFilesWithCron = async () => {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const uploads = await UploadModel.find(
        {
          uploaded_at: { $lt: oneDayAgo },
          is_use: false,
        },
        null,
        { lean: true }
      );
      for (const upload of uploads) {
        await UploadModel.deleteOne({ _id: upload._id });
        await deleteFileFromS3(upload.file_path);
      }
      return uploads.length.toString();
    } catch (error) {
      console.log("Error deleting old files:", error);
      return "0";
    }
  };
}

module.exports = { UploadController };
