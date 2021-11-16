const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  classCode: {
    type: String,
    required: true,
  },
  className: {
    type: String,
    unique: true,
    required: true,
  },
  quantity: {
    type: Number,
    min: 0,
    max: 15,
    default: 0,
  },
  majorCode: {
    type: String,
    required: true,
  },
});

const ClassModels = mongoose.model("ClassModels", classSchema, "Class");

module.exports = ClassModels;
