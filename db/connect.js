const mongoose = require("mongoose");

mongoose.set("strictQuery", true);
const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to DB ...");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // Exit the process if the connection fails
  }
};

module.exports = connectDB;
