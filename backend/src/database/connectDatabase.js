const mongoose = require("mongoose");
const env = require("../config/env");

async function connectDatabase() {
  mongoose.set("strictQuery", true);
 // await mongoose.connect(env.MONGODB_URI);
}

module.exports = connectDatabase;
