const mongoose = require("mongoose");

const majorsSchema = new mongoose.Schema({
  majorsCode: {
    type: String,
    required: true,
  },
  nameMajors: {
    type: String,
    required: true,
  },
  benchmark: {
    type: Number,
    required: true,
  },
  uuid: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    min: 0,
    required: true,
  },
});

const majorsModel = mongoose.model("majorsModel", majorsSchema, "Majors");

module.exports = majorsModel;
