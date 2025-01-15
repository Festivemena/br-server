const mongoose = require("mongoose");

const calculateReturns = require("../../utils/calculate-returns");

const MegaResalesSchema = new mongoose.Schema({
  name: { type: String, default: "MegaResalesPlan" },
  fullName: {
    type: String,
    required: true,
  },
  growthRate: { type: Number, default: 20.835 },
  currentAmount: { type: Number, default: 0 },
  duration: { type: Number, default: 48 },
  investAmount: {
    type: Number,
    required: true,
    min: 5000,
    max: 999999999999,
    default: 0,
    validate: {
      validator: function (value) {
        return value >= 5000 && value <= 999999999999;
      },
      message: "Investment amount must be between 500 and 5000",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  isActive: { type: Boolean, default: true },
  activeHours: { type: [Number], default: [] },
  startTime: { type: Date, default: Date.now() },
  pauseTime: { type: Date, default: null },
});

MegaResalesSchema.methods.updateCurrentAmount = function () {
  this.currentAmount = calculateReturns(
    this.startTime,
    this.investAmount,
    this.activeHours,
    this.growthRate,
    this.isActive
  );

  return this.save();
};

MegaResalesSchema.methods.pause = function () {
  if (this.isActive) {
    this.pauseTime = new Date().getTime();
    this.activeHours.push(
      Math.floor(
        (this.pauseTime - new Date(this.startTime).getTime()) /
          (60 * 60 * 1000)
      )
    );

    this.pauseTime = new Date(this.pauseTime).toISOString();

    this.isActive = false;
    this.startTime = null;
  }

  return this.save();
};

MegaResalesSchema.methods.resume = function () {
  if (!this.isActive) {
    this.startTime = new Date().getTime();
    this.pauseTime = null;
    this.isActive = true;

    this.startTime = new Date(this.startTime).toISOString();
  }

  return this.save();
};

MegaResalesSchema.methods.getCurrentAmount = function () {
  let currentAmount = this.currentAmount;
  const currentTime = Date.now();
  const elapsedTime = Math.floor(
    currentTime - this.createdAt.getTime()
    // (currentTime - this.createdAt.getTime()) / 1000
  );
  console.log("Elapsed Time", elapsedTime);
  let newAmount;

  if (elapsedTime >= 3600 * 48 * 1000) {
    newAmount =
      // this.investAmount +
      this.investAmount * (this.growthRate / 100) * 48;
  } else {
    const hoursElapsed = Math.floor(elapsedTime / (3600 * 1000));
    console.log("Hours Elapsed", hoursElapsed);
    newAmount =
      // this.investAmount +
      this.investAmount * (this.growthRate / 100) * hoursElapsed;
  }

  // Update the currentAmount property of the model
  this.currentAmount = newAmount;
  return this.save(); // Save the updated model to the database
};

// MegaResalesSchema.methods.getCurrentAmount = function () {
//   if (Date.now() > this.createdAt.getTime() + 3600 * 48 * 1000) {
//     return (this.investAmount +=
//       this.investAmount * (this.growthRate / 100) * 48);
//   }

//   return (this.investAmount +=
//     this.investAmount *
//     Math.floor(
//       (Date.now() - this.createdAt.getTime()) / (3600 * 1000)
//     ));
// };

const MegaResalesPlan = mongoose.model(
  "MegaResalesPlan",
  MegaResalesSchema
);

module.exports = MegaResalesPlan;
