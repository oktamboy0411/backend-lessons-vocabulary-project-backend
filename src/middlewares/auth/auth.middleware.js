const { verify } = require("jsonwebtoken");
const { JWT_SECRET } = require("../../utils/secrets/secrets.js");
const { asyncHandler } = require("../../utils/asyncHandler/asyncHandler.js");

const authMiddleware = asyncHandler((req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];
  const decoded = verify(token, JWT_SECRET);
  req.admin = decoded;
  next();
});

module.exports = { authMiddleware };
