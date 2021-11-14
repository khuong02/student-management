const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  classCode: {
    type: String,
    required: true,
  },
  nameClass: {
    type: String,
    unique: true,
    required: true,
  },
  quantity: {
    type: Number,
    min: 0,
  },
  teacherCode: {
    type: String,
  },
  codeStudents: {
    type: Array,
    required: true,
  },
});

const Class = mongoose.model("Class", classSchema, "Class");

module.exports = Class;
