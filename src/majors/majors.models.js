const mongoose = require("mongoose");

const majorsSchema = new mongoose.Schema({
  majorCode: {
    type: String,
    required: true,
  },
  nameMajor: {
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
  acceptStudent: {
    type: Boolean,
    default: true,
  },
});

const majorsModel = mongoose.model("majorsModel", majorsSchema, "Majors");

module.exports = majorsModel;
