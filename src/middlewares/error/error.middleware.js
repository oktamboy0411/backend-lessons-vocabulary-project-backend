const { StatusCodes, ReasonPhrases } = require("http-status-codes");

const errorMiddleware = (error, req, res, next) => {
  const message = error.message || ReasonPhrases.INTERNAL_SERVER_ERROR;
  const status_code = error.status_code || StatusCodes.INTERNAL_SERVER_ERROR;

  res.status(status_code).json({ success: false, message });
};

module.exports = { errorMiddleware };
