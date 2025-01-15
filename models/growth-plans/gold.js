const mongoose = require("mongoose");

const GoldGrowthPlanSchema = new mongoose.Schema({
  name: { type: String, default: "GoldGrowthPlan" },
  growthRate: { type: Number, default: 138 },
  currentAmount: { type: Number, default: 0 },
  investAmount: {
    type: Number,
    required: true,
    min: 5000,
    max: 10000,
    default: 0,
    validate: {
      validator: function (value) {
        return value >= 5000 && value <= 10000;
      },
      message: "Investment amount must be between 5000 and 10000",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  isActive: { type: Boolean, default: true },
  activeHours: { type: [Number], default: [] },
  lastCurrentAmount: { type: Number, default: 0 }, // Store the last current amount
  lastModifiedRateTime: { type: Date, default: Date.now() }, // Time when growth rate was last modified
});

GoldGrowthPlanSchema.methods.modifyGrowthRate = function (newRate) {
  const now = new Date();
  const elapsedMilliseconds = now - this.lastModifiedRateTime;
  const elapsedHours = Math.floor(elapsedMilliseconds / (1000 * 60 * 60)); // Convert milliseconds to hours
  const growthAmount =
    (this.growthRate / 100) * this.investAmount * elapsedHours;
  this.lastCurrentAmount += growthAmount; // Store the last current amount
  this.growthRate = newRate;
  this.lastModifiedRateTime = now; // Update the last modified time
  return this.save();
};

GoldGrowthPlanSchema.methods.getCurrentAmount = function () {
  if (this.lastCurrentAmount > 0) {
    const now = new Date();
    const elapsedMilliseconds = now - this.lastModifiedRateTime;
    const elapsedHours = Math.floor(elapsedMilliseconds / (1000 * 60 * 60)); // Convert milliseconds to hours
    const growthAmount =
      (this.growthRate / 100) * this.investAmount * elapsedHours;
    return (this.lastCurrentAmount += growthAmount);
  } else {
    const now = new Date();
    const elapsedMilliseconds = now - this.createdAt;
    const elapsedHours = Math.floor(elapsedMilliseconds / (1000 * 60 * 60)); // Convert milliseconds to hours
    const growthAmount =
      (this.growthRate / 100) * this.investAmount * elapsedHours;
    return (this.lastCurrentAmount += growthAmount);
  }
};

const GoldGrowthPlan = mongoose.model("GoldGrowthPlan", GoldGrowthPlanSchema);

module.exports = GoldGrowthPlan;
