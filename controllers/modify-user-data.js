const User = require("../models/user");
const niches = require("../utils/niches");
const bcrypt = require("bcryptjs");

const { CustomAPIError } = require("../errors/custom-error");

const asyncWrapper = require("../middleware/async");

function isNotEmpty(obj) {
  return Object.keys(obj).length !== 0;
}

const modifyUserData = asyncWrapper(async (req, res) => {
  const userID = req.userId;
  const userModifiedData = req.body;
  let modifiedData = {};
  const user = await User.findById(req.userId);

  if (!user) {
    return next(new CustomAPIError(`No user with ID: ${req.userId}`, 404));
  }

  if (userModifiedData.accountGiftBoxStatus == "Pending") {
    modifiedData.accountGiftBoxStatus = "Pending";
  }

  if (userModifiedData.accountGiftBoxStatus == "Inactive") {
    modifiedData.accountGiftBoxStatus = "Inactive";
  }

  if (userModifiedData.accountSmartLink == "Pending") {
    modifiedData.accountSmartLink = "Pending";
  }

  if (userModifiedData.accountSmartLink == "Inactive") {
    modifiedData.accountSmartLink = "Inactive";
  }

  if (userModifiedData.accountAdvert == "Pending") {
    modifiedData.accountAdvert = "Pending";
  }

  if (userModifiedData.accountAdvert == "Inactive") {
    modifiedData.accountAdvert = "Inactive";
  }

  if (
    userModifiedData.accountNiche &&
    !niches.includes(userModifiedData.accountNiche) &&
    userModifiedData.accountNiche != "cancel"
  ) {
    throw new CustomAPIError(
      `Invalid Niche Selected ${userModifiedData.accountNiche}`,
      404
    );
  }

  if (userModifiedData.accountNiche) {
    if (userModifiedData.accountNiche == "cancel") {
      modifiedData.accountNiche = "";
    } else {
      modifiedData.accountNiche = userModifiedData.accountNiche;
    }
  }
  if (userModifiedData.oldPassword && userModifiedData.newPassword) {
    const isPasswordValid = await user.comparePassword(
      String(userModifiedData.oldPassword)
    );

    console.log(isPasswordValid);
    console.log(userModifiedData.oldPassword);
    console.log(userModifiedData.newPassword);

    if (!isPasswordValid) {
      throw new CustomAPIError("Invalid Password", 401);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(
      userModifiedData.newPassword,
      salt
    );
    modifiedData.accountPassword = hashedPassword;
  }

  if (!isNotEmpty(modifiedData)) {
    throw new CustomAPIError(`Can't modify empty object`, 404);
  }

  const modUser = await User.findOneAndUpdate(
    { _id: userID },
    { $set: modifiedData },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!modUser) {
    throw new CustomAPIError(`No user with ID: ${userID}`, 404);
  }

  res.status(200).json({ modUser });
});

module.exports = modifyUserData;
