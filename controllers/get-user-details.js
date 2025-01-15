const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../models/user");

const { CustomAPIError } = require("../errors/custom-error");
const asyncWrapper = require("../middleware/async");

// USERS

const getUserDetails = asyncWrapper(async (req, res, next) => {
  const user = await User.findById(req.userId);

  console.log(user);

  if (!user) {
    return next(
      new CustomAPIError(`No user with ID: ${req.userId}`, 404)
    );
  }
  res.status(200).json({ user });
});

module.exports = {
  getUserDetails,
};
