const mongoose = require("mongoose");

const InstructorSchema = new mongoose.Schema({
  instructorName: String,
  instructorID: String,
  yearsofExp: String,
  instructorSpecialty: String,
  instructorProfilePic: String,
  instructorQuote: String,
});

const Instructor = mongoose.model("Instructor", InstructorSchema);

module.exports = { Instructor };
