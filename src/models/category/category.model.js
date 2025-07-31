const { Schema, model } = require("mongoose");
const { CollectionConstants } = require("../../utils/constants/constants.js");

const documentSchema = new Schema({
  name: { type: String, required: true },
  vocabulary: {
    type: Schema.Types.ObjectId,
    ref: CollectionConstants.VOCABULARY,
  },
  section: {
    type: Schema.Types.ObjectId,
    ref: CollectionConstants.SECTION,
  },
});

const CategoryModel = model(
  CollectionConstants.CATEGORY,
  documentSchema,
  CollectionConstants.CATEGORY
);

module.exports = { CategoryModel };
