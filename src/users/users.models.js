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
  majorCode: {
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
    default: "",
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
  majorCode: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
});

const StudentModels = mongoose.model("StudentModels", studentSchema, "Student");

const TeacherModels = mongoose.model("TeacherModels", teacherSchema, "Teacher");

module.exports = { StudentModels, TeacherModels };
