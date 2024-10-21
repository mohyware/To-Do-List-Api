const User = require('../Models/User');

const createUser = async (body) => {
  const user = await User.create(body);
  return user;
};

const getUser = async (email) => {
  const user = await User.findOne({ email });
  return user;
};
module.exports = { createUser, getUser };