const mongoose = require("mongoose");

const learningOutcomesSchema = new mongoose.Schema({
  studentCode: {
    type: String,
    required: true,
  },
  subjectCode: {
    type: String,
    required: true,
  },
  classCode: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  exam: {
    type: Number,
    default: 1,
  },
  point: {
    type: Number,
    minimum: 0,
  },
  teacherCode: {
    type: String,
    required: true,
  },
  year: {
    type: Date,
    default: new Date().getFullYear(),
  },
});

const learningOutcomes = mongoose.model(
  "learningOutcomes",
  learningOutcomesSchema,
  "learningOutcomes"
);

module.exports = learningOutcomes;
