const asyncWrapper = require("../middleware/async");
const BasicGrowthPlan = require("../models/growth-plans/basic");
const StarterGrowthPlan = require("../models/growth-plans/starter");
const BronzeGrowthPlan = require("../models/growth-plans/bronze");
const GoldGrowthPlan = require("../models/growth-plans/gold");
const PremiumGrowthPlan = require("../models/growth-plans/premium");
const { CustomAPIError } = require("../errors/custom-error");

const modelMapping = {
  BasicGrowthPlan: BasicGrowthPlan,
  StarterGrowthPlan: StarterGrowthPlan,
  BronzeGrowthPlan: BronzeGrowthPlan,
  GoldGrowthPlan: GoldGrowthPlan,
  PremiumGrowthPlan: PremiumGrowthPlan,
};

const getPlan = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { planType } = req.query;

  if (!modelMapping[planType]) {
    throw new CustomAPIError("Invalid userPlanType", 400);
  }

  const plan = await modelMapping[planType].findById(id);

  if (!plan) {
    throw new CustomAPIError("Plan doesn't exist", 400);
  }

  const currentAmount = await plan.getCurrentAmount();

  res.status(200).json({
    planDetails: {
      plan,
      isActive: plan.isActive,
      currentAmount,
    },
  });
});

module.exports = getPlan;
