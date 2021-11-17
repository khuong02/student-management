const CurrentYear = new Date().getFullYear() % 100;

module.exports = (nameMajor, num) => {
  let name = "";
  switch (nameMajor.toLowerCase()) {
    case "cntt":
      name = "TH";
      break;

    default:
      name = nameMajor;
      break;
  }

  return `CD${name}${CurrentYear}${String.fromCharCode(64 + num)}`;
};
