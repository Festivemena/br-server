const crypto = require("crypto");
const User = require("../models/user");

const asyncWrapper = require("../middleware/async");
const { CustomAPIError } = require("../errors/custom-error");

const {
  sendPasswordResetEmail,
} = require("../utils/sendPasswordResetEmail");

const forgotPassword = asyncWrapper(async (req, res) => {
  const { accountEmail } = req.body;
  const user = await User.findOne({ accountEmail }).exec();

  if (!user) {
    throw new CustomAPIError("User doesn't Exist", 401);
  }

  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
  await user.save();

  const respo = await sendPasswordResetEmail(
    user.accountEmail,
    resetToken
  );
  console.log(respo);
  console.log(typeof respo);

  if (!respo.accepted) {
    throw new CustomAPIError("Error sending reset email", 400);
  }

  return res
    .status(200)
    .json({ message: "Password reset email sent successfully" });
});

module.exports = forgotPassword;
