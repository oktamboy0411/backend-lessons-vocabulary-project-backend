const { StatusCodes } = require("http-status-codes");
const {
  HttpException,
} = require("../../utils/http-exception/http-exception.js");
const { REG_KEY, JWT_SECRET } = require("../../utils/secrets/secrets.js");
const { AdminModel } = require("../../models/admin/admin.model.js");
const { genSalt, hash, compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");

class AdminController {
  static signUp = async (req, res) => {
    const { phone, password, reg_key, name } = req.body;

    if (reg_key !== REG_KEY) {
      throw new HttpException(
        StatusCodes.FORBIDDEN,
        "Invalid registration key"
      );
    }

    const existingAdmin = await AdminModel.findOne({ phone });

    if (existingAdmin) {
      throw new HttpException(
        StatusCodes.CONFLICT,
        "User phone already exists"
      );
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    await AdminModel.create({ name, phone, password: hashedPassword });

    res
      .status(StatusCodes.CREATED)
      .json({ success: true, message: "Admin created successfully" });
  };

  static login = async (req, res) => {
    const { phone, password } = req.body;

    const admin = await AdminModel.findOne({ phone });
    if (!admin) {
      throw new HttpException(
        StatusCodes.UNAUTHORIZED,
        "Invalid phone or password"
      );
    }

    const isPasswordValid = await compare(password, admin.password);
    if (!isPasswordValid) {
      throw new HttpException(
        StatusCodes.UNAUTHORIZED,
        "Invalid phone or password"
      );
    }

    const token = sign({ admin_id: admin._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(StatusCodes.OK).json({ success: true, token });
  };

  static getProfile = async (req, res) => {
    const { admin_id } = req.admin;
    const admin = await AdminModel.findById(admin_id).select("-password");

    if (!admin) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Admin not found!");
    }

    res.status(StatusCodes.OK).json({ success: true, data: admin });
  };
}

module.exports = { AdminController };
