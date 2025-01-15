const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../../models/user");

const { CustomAPIError } = require("../../errors/custom-error");
const asyncWrapper = require("../../middleware/async");

// USERS

const getUserDetailsAdmin = asyncWrapper(async (req, res, next) => {
  const { id } = req.query;
  const user = await User.findById(id);

  console.log(user);

  if (!user) {
    return next(new CustomAPIError(`No user with ID: ${req.id}`, 404));
  }
  res.status(200).json({ user });
});

module.exports = getUserDetailsAdmin;
