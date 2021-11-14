const countData = async (model) => {
  return await model.countDocuments().exec();
};

module.exports = countData;
