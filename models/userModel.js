const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A User must have a name"],
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "Email id is required"],
    validate: [validator.isEmail, "A valid email needed"],
  },
  photo: {
    type: String,
    required: [true, "A profile image is required"],
  },
  password: {
    type: String,
    required: [true, "Provide a password"],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Plese confirm your password"],
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
