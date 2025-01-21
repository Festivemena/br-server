const mongoose = require("mongoose");
const User = require("./user");
const { CustomAPIError } = require("../errors/custom-error");

const BasicGrowthPlan = require("./growth-plans/basic");
const StarterGrowthPlan = require("./growth-plans/starter");
const BronzeGrowthPlan = require("./growth-plans/bronze");
const GoldGrowthPlan = require("./growth-plans/gold");
const PremiumGrowthPlan = require("./growth-plans/premium");

const modelMapping = {
  BasicGrowthPlan: BasicGrowthPlan,
  StarterGrowthPlan: StarterGrowthPlan,
  BronzeGrowthPlan: BronzeGrowthPlan,
  GoldGrowthPlan: GoldGrowthPlan,
  PremiumGrowthPlan: PremiumGrowthPlan,
};

const TransactionSchema = new mongoose.Schema({
  txMethod: {
    type: String,
    enum: ["Bitcoin", "Ethereum", "USDT", "Bank"],
  },
  txAmount: { type: Number, required: [true, "Must provide Amount"] },
  txStatus: {
    type: String,
    enum: ["Successful", "Pending", "Failed"],
    default: "Pending",
  },
  txType: {
    type: String,
    enum: ["Withdrawal", "Deposit", "Commission"],
  },
  paymentFile: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

TransactionSchema.virtual("userId")
  .get(function () {
    return this._userId;
  })
  .set(function (userId) {
    this._userId = userId;
  });

TransactionSchema.pre("save", async function (next) {
  try {
    if (this.txType == "Deposit") {
      return next();
    }
    const userId = this.userId;

    const user = await User.findById(userId);

    // const plans = user.selectedPlans;

    // const generatedEquity = [];

    // for (const planName in plans) {
    //   if (plans.hasOwnProperty(planName)) {
    //     const planData = plans[planName];

    //     if (Array.isArray(planData) && planData.length > 0) {
    //       console.log(`Making requests for plan: ${planName}`);

    //       // const promises = planData.map(async (item) => {
    //       //   console.log(`  Fetching data for ${planName}: ${item}`);
    //       //   const res = await fetchDataFromRoute(
    //       //     `plans/${item}`,
    //       //     "get",
    //       //     null,
    //       //     { planType: planName }
    //       //   );
    //       //   return Math.floor(res.planDetails.currentAmount);
    //       // });

    //       // const results = await Promise.all(promises);

    //       // generatedEquity.push(...results);
    //     }
    //   }
    // }

    if (!user.isMarketingLandscapeIssue) {
      throw new CustomAPIError(
        "Marketing Landscape issue detected",
        400
      );
    }

    if (!user.isCommissionFeePaid) {
      throw new CustomAPIError("Commission Fee not paid", 400);
    }

    if (!user.isAccountUpgraded) {
      throw new CustomAPIError(
        "Your account is due for an upgrade",
        400
      );
    }
    if (!user.isAccountVerified) {
      throw new CustomAPIError("Account not verified", 400);
    }

    if (!user.isIMCPaid) {
      throw new CustomAPIError(
        "IMC - Investment Management Charges not paid",
        400
      );
    }

    if (!user.isAccountUpdated) {
      throw new CustomAPIError("your Account is due for update", 400);
    }

    if (!user.isAMCPaid) {
      throw new CustomAPIError(
        "AMC - Account Maintenance Fee not paid",
        400
      );
    }

    if (!user.isSwitchTransferFeePaid) {
      throw new CustomAPIError(
        "Switch your equity to the account balance",
        400
      );
    }

    if (!user.isReflectionFeePaid) {
      throw new CustomAPIError("Reflection Fee not paid", 400);
    }
    if (!user.isDistributionFeePaid) {
      throw new CustomAPIError("Distribution Fee not paid", 400);
    }

    if (!user.isSpreadFeePaid) {
      throw new CustomAPIError("Spread Fee not paid", 400);
    }

    if (!user.isRecommitmentFeePaid) {
      throw new CustomAPIError("Recommitment Fee not paid", 400);
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Transaction", TransactionSchema);
