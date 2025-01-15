const crypto = require("crypto");
const User = require("../models/user");
const asyncWrapper = require("../middleware/async");
const { CustomAPIError } = require("../errors/custom-error");
const { sendVerificationEmail } = require("../utils/sendVerificationEmail");

const sendUserVerificationEmail = asyncWrapper(async (req, res) => {
  const { accountEmail } = req.body;

  // Check if user exists
  // const user = await User.findOne({ accountEmail }).exec();
  const user = await User.findOne({
    accountEmail: new RegExp("^" + accountEmail + "$", "i"),
  }).exec();

  console.log(user);
  if (!user) {
    throw new CustomAPIError("User not found", 404);
  }

  // Generate verification token
  const verificationToken = crypto.randomBytes(20).toString("hex");

  // Update user record with verification token
  user.emailVerificationToken = verificationToken;
  user.emailVerificationTokenExpires = Date.now() + 3600000; // Token expires in 1 hour

  await user.save();

  // Send verification email
  const emailResult = await sendVerificationEmail(
    accountEmail,
    verificationToken,
  );

  if (emailResult instanceof Error) {
    throw new CustomAPIError("Failed to send verification email", 500);
  }

  console.log(emailResult)

  res
    .status(200)
    .json({ success: true, message: "Verification email sent successfully" });
});

module.exports = sendUserVerificationEmail;
