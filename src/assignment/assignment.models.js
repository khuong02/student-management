const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  classCode: {
    type: String,
    required: true,
  },
  teacherCode: {
    type: String,
    required: true,
  },
  subjectCode: {
    type: String,
    required: true,
  },
  year: {
    type: Date,
    default: new Date().getFullYear(),
  },
  semester: {
    type: Number,
    required: true,
  },
});

const Assignment = mongoose.model("Assignment", assignmentSchema, "Assignment");

module.exports = Assignment;
