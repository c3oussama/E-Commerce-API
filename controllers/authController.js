const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const User = require("../models/userModel");
const { attachCookiesToResponse, createTokenUser } = require("../utils");

const register = async (req, res) => {
  const { email, name, password } = req.body;

  //check if the email is already existe
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("Email is already in use");
  }

  //first registred user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  //create user
  const user = await User.create({ name, password, email, role });
  if (!user) {
    throw new CustomError.BadRequestError("Please check your inputs");
  }

  //create a token
  const userToken = createTokenUser(user);
  attachCookiesToResponse({ res, user: userToken });
  res.status(StatusCodes.CREATED).json({ user: userToken });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("Please entre email and password.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid credentials.");
  }
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid credentials.");
  }

  //create a token
  const userToken = createTokenUser(user);
  attachCookiesToResponse({ res, user: userToken });
  res.status(StatusCodes.OK).json({ user: userToken });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "logout controller" });
};

module.exports = {
  login,
  register,
  logout,
};
