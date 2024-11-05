const User = require("../models/userModel");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} = require("../utils");

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json(users);
};

const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.userId }).select(
    "-password"
  );

  if (!user) {
    throw new CustomError.NotFoundError(
      `There is no user with id : ${req.params.userId}`
    );
  }

  checkPermissions(req.user, req.params.userId);
  res.status(StatusCodes.OK).json(user);
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    throw new CustomError.BadRequestError("Please enter name and email");
  }

  //check if email already exists
  const user = await User.findOne({ _id: req.user.userId });
  user.name = name;
  user.email = email;
  // Save the updated user
  await user.save();

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Please prvide bothe values.");
  }
  const user = await User.findOne({ _id: req.user.userId });
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("invalie credentials");
  }
  user.password = newPassword;
  await user.save(user);
  res.status(StatusCodes.OK).json({ masg: "password updated with success" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};

/* Update User with findOneAndUpdate
const updateUser = async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
      throw new CustomError.BadRequestError("Please enter name and email");
    }
  
    //check if email already exists
    const user = await User.findOneAndUpdate(
      { _id: req.user.userId },
      { name, email },
      { new: true, runValidators: true }
    );
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ user: tokenUser });
  }; */
