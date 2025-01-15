const jwt = require("jsonwebtoken");
const User = require("../models/user");
const asyncWrapper = require("../middleware/async");
const { CustomAPIError } = require("../errors/custom-error");

const userLogin = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  const user = await User.findOne({
    accountEmail: new RegExp("^" + email + "$", "i"),
  }).exec();

  if (!user) {
    throw new CustomAPIError("User doesn't Exist", 401);
  }

  const isPasswordValid = await user.comparePassword(String(password));

  console.log(isPasswordValid);
  console.log(password);
  console.log(user.accountPassword);

  if (!isPasswordValid) {
    throw new CustomAPIError("Incorrect Password", 401);
  }

  if (!user.isEmailVerified) {
    throw new CustomAPIError("Email not verified", 401);
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });

  res.status(200).json({ token, user });
});

module.exports = userLogin;
