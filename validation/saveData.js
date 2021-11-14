module.exports = async (model, objContent) => {
  if (!model || !objContent)
    throw new Error("Model or content does not exist.");
  const data = new model(objContent);
  await data.save();
  return "Success";
};
