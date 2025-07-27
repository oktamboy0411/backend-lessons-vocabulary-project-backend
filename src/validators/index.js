const { validationResult } = require("express-validator");
const { HttpException } = require("../utils/http-exception/http-exception.js");
const { StatusCodes } = require("http-status-codes");

const expressValidatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  let errorMessages = errors
    .array()
    .map((error) => error.msg)
    .join(" ");

  throw new HttpException(StatusCodes.UNPROCESSABLE_ENTITY, errorMessages);
};

module.exports = { expressValidatorMiddleware };
