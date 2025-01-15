const User = require("../models/user");

const { CustomAPIError } = require("../errors/custom-error");
const asyncWrapper = require("../middleware/async");

// USERS

const getUserReferrals = asyncWrapper(async (req, res, next) => {
  const user = await User.findById(req.userId);

  if (!user) {
    return next(
      new CustomAPIError(`No user with ID: ${req.userId}`, 404)
    );
  }

  const refIDs = user.userReferrals;

  if (refIDs.length < 1) {
    return res.status(200).json({ referrer: [] });
  }

  const referrer = await User.find(
    { refID: { $in: refIDs.map(Number) } },
    { createdAt: 1, fullName: 1, refID: 1 }
  );

  res.status(200).json({ referrer });
});

module.exports = getUserReferrals;
