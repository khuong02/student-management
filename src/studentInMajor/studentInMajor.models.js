const mongoose = require("mongoose");

const studentInMajorSchema = new mongoose.Schema({
  majorCode: {
    type: String,
    required: true,
  },
  studentCode: {
    type: String,
    required: true,
  },
});

const StudentInMajor = mongoose.model(
  "StudentInMajor",
  studentInMajorSchema,
  "StudentInMajors"
);

module.exports = StudentInMajor;
