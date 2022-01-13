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
  activity: {
    type: Boolean,
    default: true,
  },
  avatar: {
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
  majorCode: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  year: {
    type: Date,
    default: new Date(),
  },
  activity: {
    type: Boolean,
    default: true,
  },
  avatar: {
    type: String,
  },
});

const userSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
  },
  roles: {
    type: String,
    required: true,
  },
  account: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    require: true,
  },
});

const StudentModels = mongoose.model("StudentModels", studentSchema, "Student");

const TeacherModels = mongoose.model("TeacherModels", teacherSchema, "Teacher");

const UserModels = mongoose.model("UserModels", userSchema, "User");

module.exports = { StudentModels, TeacherModels, UserModels };
