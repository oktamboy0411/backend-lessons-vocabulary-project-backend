const { Schema, model } = require("mongoose");
const {
  CollectionConstants,
  RoleConstants,
} = require("../../utils/constants/constants.js");

const documentSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: [RoleConstants.CEO, RoleConstants.ADMIN, RoleConstants.USER],
      default: RoleConstants.ADMIN,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

const AdminModel = model(
  CollectionConstants.ADMIN,
  documentSchema,
  CollectionConstants.ADMIN
);

module.exports = { AdminModel };
