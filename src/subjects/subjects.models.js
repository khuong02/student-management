const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subjectCode: {
    type: String,
    required: true,
  },
  nameSubject: {
    type: String,
    unique: true,
    required: true,
  },
  numberOfCredits: {
    type: Number,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  majorsCode: {
    type: String,
    required: true,
  },
});

const Subjects = mongoose.model("Subjects", subjectSchema, "Subjects");

module.exports = Subjects;
