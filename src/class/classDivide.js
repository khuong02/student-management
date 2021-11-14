module.exports = (nameMajor, currentYear, num) => {
  let name = "";
  switch (nameMajor.toLowerCase()) {
    case "cntt":
      name = "TH";
      break;

    default:
      name = nameMajor;
      break;
  }

  return `CD${name}${currentYear}${String.fromCharCode(64 + num)}`;
};
