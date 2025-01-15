const mongoose = require("mongoose");

const VIPGrowthPlanSchema = new mongoose.Schema({
  name: { type: String, default: "VIPGrowthPlan" },
  growthRate: { type: Number, default: 138 },
  currentAmount: { type: Number, default: 0 },
  investAmount: {
    type: Number,
    required: true,
    min: 20000,
    max: 999999999,
    default: 0,
    validate: {
      validator: function (value) {
        return value >= 20000 && value <= 999999999;
      },
      message: "Investment amount must be between 20000 and 999999999",
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

VIPGrowthPlanSchema.methods.modifyGrowthRate = function (newRate) {
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

VIPGrowthPlanSchema.methods.getCurrentAmount = function () {
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

const VIPGrowthPlan = mongoose.model("VIPGrowthPlan", VIPGrowthPlanSchema);

module.exports = VIPGrowthPlan;
