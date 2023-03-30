const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const appError = require("./../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(User._id);

  res.status(201).json({
    status: "Success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new appError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new appError("Incorrect Email or Password !", 401));
  }

  const token = signToken(user._id);
  res.status(200).json({
    status: "Success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new appError("You are not logged in, Login with your credentials")
    );
  }

  const decoded = catchAsync(
    await promisify(jwt.verify)(token, process.env.JWT_SECRET)
  );

  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new appError(
        "The user belonging to this token does no longer exist!",
        401
      )
    );
  }

  next();
});
