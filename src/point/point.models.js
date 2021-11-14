const mongoose = require("mongoose");

const pointSchema = new mongoose.Schema({
  studentCode: {
    type: String,
    required: true,
  },
  subjectCode: {
    type: String,
    required: true,
  },
  point: {
    type: Number,
    minimum: 0,
  },
  teacherCode: {
    type: String,
    required: true,
  },
});

const Point = mongoose.model("Point", pointSchema, "Point");

module.exports = Point;
