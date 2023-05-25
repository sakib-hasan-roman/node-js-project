const mongoose = require("mongoose");
const url =
  process.env.SERVER_MOOD == "development"
    ? process.env.DEVELOPMENT_DB
    : process.env.PRODUCTION_DB;
console.log(url);
//Now connect Mongodb .......
const connectDB = async () => {
  try {
    const connected = await mongoose.connect(url);
    console.log("Connected Successfully ....!");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = connectDB;
