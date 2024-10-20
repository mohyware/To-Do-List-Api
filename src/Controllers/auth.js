const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const userService = require('../services/auth');
const createJWT = require('../utilities/Jwt');
const { hash, comparePassword } = require('../utilities/password');
const register = async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    throw new BadRequestError('Please provide email ,name and password');
  }

  const hashedPassword = await hash(password);
  const user = await userService.createUser({ email, password: hashedPassword, name });
  const token = createJWT(user.id, user.name);
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const user = await userService.getUser(email);

  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials');
  }
  const isPasswordCorrect = await comparePassword(password, user.password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials');
  }
  const token = createJWT(user.id, user.name);
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  register,
  login,
};
