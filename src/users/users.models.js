const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  roles: {
    type: String,
    default: "03",
  },
  name: {
    type: String,
    required: true,
  },
  studentCode: {
    type: String,
    unique: true,
    required: true,
  },
  class: {
    type: String,
  },
  uuid: {
    type: String,
    unique: true,
    required: true,
  },
  account: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  majorsCode: {
    type: String,
    required: true,
  },
  schoolYear: {
    type: String,
  },
  address: {
    type: String,
  },
  classCode: {
    type: String,
  },
});

const teacherSchema = new mongoose.Schema({
  roles: {
    type: String,
    default: "01",
  },
  name: {
    type: String,
    required: true,
  },
  teacherCode: {
    type: String,
    unique: true,
    required: true,
  },
  uuid: {
    type: String,
    unique: true,
    required: true,
  },
  account: {
    type: String,
    unique: true,
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  majorsCode: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
});

const Student = mongoose.model("Student", studentSchema, "Student");

const Teacher = mongoose.model("Teacher", teacherSchema, "Teacher");

module.exports = { Student, Teacher };
