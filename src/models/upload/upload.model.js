const { Schema, model } = require("mongoose");
const { CollectionConstants } = require("../../utils/constants/constants.js");

const documentSchema = new Schema(
  {
    file_path: { type: String, required: true },
    is_use: { type: Boolean, default: false },
    uploaded_at: { type: Date, default: Date.now },
    where_used: {
      type: String,
      enum: [CollectionConstants.VOCABULARY, CollectionConstants.SECTION],
    },
  },
  { versionKey: false }
);

const UploadModel = model(
  CollectionConstants.UPLOAD,
  documentSchema,
  CollectionConstants.UPLOAD
);

module.exports = { UploadModel };
