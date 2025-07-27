const { Schema, model } = require("mongoose");
const {
  VocabularyTypes,
  CollectionConstants,
} = require("../../utils/constants/constants.js");

const documentSchema = new Schema({
  type: {
    type: String,
    enum: [VocabularyTypes.MODERN, VocabularyTypes.HISTORY],
    required: true,
  },
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String },
});

const VocabularyModel = model(
  CollectionConstants.VOCABULARY,
  documentSchema,
  CollectionConstants.VOCABULARY
);

module.exports = { VocabularyModel };
