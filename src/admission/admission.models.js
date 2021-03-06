const mongoose = require("mongoose");

const admissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    max: 256,
    min: 1,
  },
  email: {
    type: String,
    required: true,
  },
  numberPhone: {
    type: Number,
  },
  point: {
    type: Number,
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  aspirations_arr: {
    type: Array,
    required: true,
  },
  major: {
    type: String,
  },
});
// const remove = async () => {
//   await Admission.remove();
// };

// remove();

const Admission = mongoose.model(
  "Admission",
  admissionSchema,
  "RegisterStudent"
);

module.exports = Admission;
