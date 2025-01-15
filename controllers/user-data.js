const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../models/user");
const BasicGrowthPlan = require("../models/growth-plans/basic");
const StarterGrowthPlan = require("../models/growth-plans/starter");
const BronzeGrowthPlan = require("../models/growth-plans/bronze");
const GoldGrowthPlan = require("../models/growth-plans/gold");
const PremiumGrowthPlan = require("../models/growth-plans/premium");
const VIPGrowthPlan = require("../models/vip-plans/vip");
const { CustomAPIError } = require("../errors/custom-error");
const asyncWrapper = require("../middleware/async");

const modelMapping = {
  BasicGrowthPlan: BasicGrowthPlan,
  StarterGrowthPlan: StarterGrowthPlan,
  BronzeGrowthPlan: BronzeGrowthPlan,
  GoldGrowthPlan: GoldGrowthPlan,
  PremiumGrowthPlan: PremiumGrowthPlan,
  VIPGrowthPlan: VIPGrowthPlan,
};

// USERS

const getUserData = asyncWrapper(async (req, res, next) => {
  const { id: userID } = req.params;
  const user = await User.findOne({ _id: userID }).exec();

  if (!user) {
    return next(
      new CustomAPIError(`No user with ID: ${userID}`, 404)
    );
  }
  res.status(200).json({ user });
});

const getUserPlans = asyncWrapper(async (req, res, next) => {
  const user = await User.findById(req.userId).populate({
    path: "selectedPlans",
  });

  let plans = [];

  // for (const key in user.selectedPlans) {
  //   if (user.selectedPlans.hasOwnProperty(key)) {
  //     const planArray = user.selectedPlans[key];

  //     if (planArray.length > 0) {
  //       const planName = planArray[0];

  //       console.log(key);
  //       console.log(planName);

  //       const PlanModel = modelMapping[key];
  //       const plan = await PlanModel.findById(planName);
  //       plans.push(plan);
  //     }
  //   }
  // }

  if (!user) {
    throw new CustomAPIError(`No user with ID: ${req.userId}`, 404);
  }

  if (checkEmptyArrays(plans)) {
    plans = [];
  } else {
    plans = user.selectedPlans;
  }

  // const plans =
  //   user.selectedPlans.length > 0 ? user.selectedPlans : [];

  res.status(200).json({ plans, user });
});

const resetUserPassword = (req, res) => {
  res.send("Successfully reset password");
};

const modifyUserData = asyncWrapper(async (req, res) => {
  const { id: userID } = req.params;
  const user = await User.findOneAndUpdate(
    { _id: userID },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    // return next(createCustomError(`No user with ID: ${userID}`, 404));
    return next(
      new CustomAPIError(`No user with ID: ${userID}`, 404)
    );
  }

  res.status(200).json({ user });
  // res.status(200).json({ id: userID, data: req.body });
});

// ADMIN

const getAllUsersData = asyncWrapper(async (req, res) => {
  console.log(req.adminDetails);
  const allUsers = await User.find({});
  res.status(200).json({
    data: allUsers,
    noOfUsers: allUsers.length,
    success: true,
  });
});

const deleteUserData = asyncWrapper(async (req, res, next) => {
  const { id: userID } = req.params;
  const user = await User.findOneAndDelete({ _id: userID });

  if (!user) {
    // return next(createCustomError(`No user with ID: ${userID}`, 404));
    return next(
      new CustomAPIError(`User not Found: ${userID}`, 404)
    );
  }

  res.status(200).json({ user });
});

module.exports = {
  getUserData,
  resetUserPassword,
  modifyUserData,
  getAllUsersData,
  deleteUserData,
  getUserPlans,
};

function checkEmptyArrays(plans) {
  for (const plan in plans) {
    if (plans.hasOwnProperty(plan)) {
      if (plans[plan].length === 0) {
        return false;
      } else {
        return true;
      }
    }
  }
}
