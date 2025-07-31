const { Schema, model } = require("mongoose");
const { CollectionConstants } = require("../../utils/constants/constants.js");

const documentSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  category: {
    type: Schema.Types.ObjectId,
    ref: CollectionConstants.CATEGORY,
    required: true,
  },
  section: {
    type: Schema.Types.ObjectId,
    ref: CollectionConstants.SECTION,
    required: true,
  },
  vocabulary: {
    type: Schema.Types.ObjectId,
    ref: CollectionConstants.VOCABULARY,
    required: true,
  },
});

const WordModel = model(
  CollectionConstants.WORD,
  documentSchema,
  CollectionConstants.WORD
);

module.exports = { WordModel };
