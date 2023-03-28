const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const appError = require("./../utils/appError");

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: "Success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  // email = req.body.email
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new appError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  console.log(user);

  const token = "";
  res.status(200).json({
    status: "Success",
    token,
  });
});
