const moment = require("moment");

const format = (date) => {
  return moment(date).format("DD-MM-YYYY");
};

module.exports = format;
