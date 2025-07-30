const { Schema, model } = require("mongoose");
const { CollectionConstants } = require("../../utils/constants/constants.js");

const documentSchema = new Schema(
  {
    name: { type: String, required: true },
    vocabulary: {
      type: Schema.Types.ObjectId,
      ref: CollectionConstants.VOCABULARY,
      required: true,
    },
    image: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const SectionModel = model(
  CollectionConstants.SECTION,
  documentSchema,
  CollectionConstants.SECTION
);

module.exports = { SectionModel };
