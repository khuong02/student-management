//formatStudentCode => 03-majors-schoolYear-number
//formatTeacherCode => 01-majors-yearOfWork-number

const formatStudentCode = (majors, schoolYear, number) => {
  return "03" + majors + schoolYear + number.toString().padStart(4, "0");
};

const formatTeacherCode = (majors, yearOfWork, number) => {
  return "01" + majors + yearOfWork + number.toString().padStart(4, "0");
};

module.exports = { formatStudentCode, formatTeacherCode };
