const { connect } = require("mongoose");
const { MONGO_DB_URI } = require("../secrets/secrets.js");

const connectDB = async () => {
  try {
    await connect(MONGO_DB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};

module.exports = { connectDB };
