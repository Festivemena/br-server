const asyncWrapper = require("../middleware/async");
const BasicGrowthPlan = require("../models/growth-plans/basic");
const StarterGrowthPlan = require("../models/growth-plans/starter");
const BronzeGrowthPlan = require("../models/growth-plans/bronze");
const GoldGrowthPlan = require("../models/growth-plans/gold");
const PremiumGrowthPlan = require("../models/growth-plans/premium");
const VIPPlan = require("../models/vip-plans/vip");
const { CustomAPIError } = require("../errors/custom-error");

const modelMapping = {
  BasicGrowthPlan: BasicGrowthPlan,
  StarterGrowthPlan: StarterGrowthPlan,
  BronzeGrowthPlan: BronzeGrowthPlan,
  GoldGrowthPlan: GoldGrowthPlan,
  PremiumGrowthPlan: PremiumGrowthPlan,
  VIPPlan: VIPPlan,
};

const updatePlan = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { planType, growthRate, maxInvestAmount, isActive } = req.body;
  console.log(req.body);

  if (!planType) {
    throw new CustomAPIError("Invalid Plan Type", 400);
  }

  if (parseFloat(growthRate) < 0 && !maxInvestAmount) {
    throw new CustomAPIError("Invalid mods", 400);
  }

  const Model = modelMapping[planType];

  if (!Model) {
    throw new CustomAPIError(`Invalid planType: ${planType}`, 400);
  }

  const plan = await Model.findById(id);

  const updateObj = {};

  if (parseFloat(growthRate) >= 0) {
    updateObj.growthRate = parseFloat(growthRate);
    await plan.modifyGrowthRate(updateObj.growthRate);
  }

  if (isActive !== undefined && plan.isActive !== isActive) {
    if (isActive === "true") {
      await plan.resume();
    } else if (isActive === "false") {
      await plan.pause();
    }
    updateObj.isActive = isActive;
  }

  console.log(updateObj);

  const userPlan = await Model.updateOne({ _id: id }, { $set: updateObj });
  await plan.save();

  res.status(200).json({ msg: "Success", userPlan, updateObj });
});

module.exports = updatePlan;
