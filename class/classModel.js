const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
  category: String,
  instructorName: String,
  className: String,
  classDate: String,
  classID: String,
  classTier: String,
});

const Class = mongoose.model("Class", ClassSchema);

module.exports = { Class };
