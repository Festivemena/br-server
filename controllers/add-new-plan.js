const User = require("../models/user");
const BasicGrowthPlan = require("../models/growth-plans/basic");
const StarterGrowthPlan = require("../models/growth-plans/starter");
const BronzeGrowthPlan = require("../models/growth-plans/bronze");
const GoldGrowthPlan = require("../models/growth-plans/gold");
const PremiumGrowthPlan = require("../models/growth-plans/premium");
const VIPGrowthPlan = require("../models/vip-plans/vip");
const MegaResalesPlan = require("../models/vip-plans/mega-resales");

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

function isBoolean(str) {
  str = str.toLowerCase();

  return str === "true" || str === "false";
}

const addNewPlan = asyncWrapper(async (req, res) => {
  const { userPlanType, userAmount } = req.body;
  let { isMegaResale } = req.query;
  console.log(req.body);
  console.log(req.query);

  if (isMegaResale && !isBoolean(isMegaResale)) {
    throw new CustomAPIError("Only Boolean Values accepted", 400);
  }

  const user = await User.findById(req.userId);

  if (user.accountBalance <= 0 || user.accountBalance < Number(userAmount)) {
    throw new CustomAPIError("Insufficient Balance to Invest", 400);
  }

  if (Number(userAmount) <= 0) {
    throw new CustomAPIError("Amount must be more than zero", 400);
  }

  if (!modelMapping[userPlanType]) {
    throw new CustomAPIError("Invalid userPlanType", 400);
  }

  const PlanModel = modelMapping[userPlanType];

  const newPlan = new PlanModel({
    investAmount: userAmount,
  });

  let megaResalePlanOption;

  if (typeof isMegaResale !== "undefined") {
    megaResalePlanOption = new MegaResalesPlan({
      investAmount: userAmount,
      fullName: user.fullName,
    });

    await megaResalePlanOption.save();

    const mrpID = megaResalePlanOption._id;
    user.megaResalePlans.push(mrpID);
  } else {
    let validationError = newPlan.validateSync();
    console.log(validationError);

    if (validationError) {
      console.log(validationError.errors["investAmount"].message);
      throw new CustomAPIError("Amount out of Range", 400);
    }

    await newPlan.save();
    // await newPlan.updateCurrentAmount();

    const planId = newPlan._id;
    user.accountAffiliateCapital += Number(userAmount);
    user.selectedPlans[userPlanType].push(planId);
  }

  user.accountBalance -= Number(userAmount);

  await user.save();

  res.status(200).json({
    msg: "Successfully invested",
    plan: newPlan,
    user,
    megaResalePlanOption,
  });
});

module.exports = addNewPlan;
