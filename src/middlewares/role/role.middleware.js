const { StatusCodes } = require("http-status-codes");
const { AdminModel } = require("../../models/admin/admin.model.js");
const {
  HttpException,
} = require("../../utils/http-exception/http-exception.js");

const roleMiddleware = (roles) => async (req, res, next) => {
  const { admin_id } = req.admin;

  const admin = await AdminModel.findById(admin_id);

  if (!roles.includes(admin.role)) {
    throw new HttpException(
      StatusCodes.FORBIDDEN,
      "You do not have permission to perform this action"
    );
  }

  next();
};

module.exports = { roleMiddleware };
