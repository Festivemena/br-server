const User = require("../models/user");
const asyncWrapper = require("../middleware/async");
const { CustomAPIError } = require("../errors/custom-error");

const verifyUserEmail = asyncWrapper(async (req, res) => {
  const { emailVerificationToken } = req.body;

  const user = await User.findOne({
    emailVerificationToken,
  });

  if (!user) {
    throw new CustomAPIError("User not found, invalid token", 404);
  }

  if (Date.now() > user.emailVerificationTokenExpires) {
    throw new CustomAPIError("User token expired", 400);
  }

  user.isEmailVerified = true;
  user.emailVerificationDate = Date.now();

  await user.save();

  res
    .status(200)
    .json({ success: true, message: "User successfully verified" });
});

module.exports = verifyUserEmail;
