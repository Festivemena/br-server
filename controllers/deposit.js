const jwt = require("jsonwebtoken");
const User = require("../models/user");
const asyncWrapper = require("../middleware/async");
const { CustomAPIError } = require("../errors/custom-error");

const depositFunds = asyncWrapper(async (req, res) => {
  const { amount } = req.body;
  console.log(req.body)
  const user = await User.findById(req.userId);

  res.status(200).json({ token, user });
});

module.exports = depositFunds;
