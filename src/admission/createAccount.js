const createAccount = (code) => {
  return {
    account: code + "@caothang.edu.vn",
    password: "123456789",
  };
};

module.exports = createAccount;
