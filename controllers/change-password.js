const User = require("../models/user");
const bcrypt = require("bcryptjs");
const asyncWrapper = require("../middleware/async");
const { CustomAPIError } = require("../errors/custom-error");

const changePassword = asyncWrapper(async (req, res) => {
  const { token } = req.query;
  const { accountEmail, newPassword } = req.body;
  console.log(req.body)

  // Check if the token is provided
  if (!token) {
    throw new CustomAPIError("Token is required", 400);
  }

  // Find the user associated with the provided email address
  const user = await User.findOne({
    accountEmail,
    resetPasswordToken: token,
  });

  // If user or token is not found or token is expired
  if (!user || user.resetPasswordExpires < Date.now()) {
    throw new CustomAPIError("Invalid or expired token", 400);
  }

  // Encrypt the new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update user's password
  user.accountPassword = hashedPassword;
  user.resetPasswordToken = "";
  user.resetPasswordExpires = "";
  await user.save();

  res.status(200).json({ message: "Password changed successfully" });
});

module.exports = changePassword;
