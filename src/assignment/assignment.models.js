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
  },
  year: {
    type: Date,
    default: new Date(),
  },
  semester: {
    type: Number,
  },
  typeAssignment: {
    type: Number,
    required: true,
  },
});

const Assignment = mongoose.model("Assignment", assignmentSchema, "Assignment");

module.exports = Assignment;
