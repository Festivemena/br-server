const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
const bcrypt = require("bcryptjs");

const countries = require("../utils/countries");

const DealsSchema = new mongoose.Schema({
  capital: {
    type: Number,
    required: [true, "Please provide capital"],
  },
  dealType: {
    type: String,
    required: [true, "Must provide deal type"],
    enum: ["Gold", "Premium", "VIP"],
  },
  dealDuration: {
    type: Number,
    default: 24,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

DealsSchema.methods.getCurrentPercentage = function () {
  if (
    Math.round(
      (new Date().getTime() - new Date(this.createdAt).getTime) /
        (1000 * 60 * 60)
    ) >= 24
  ) {
    return 100;
  } else {
    return (
      Math.round(
        (new Date().getTime() - new Date(this.createdAt).getTime) /
          (1000 * 60 * 60)
      ) * Number(100 / 24).toFixed(2)
    );
  }
};

module.exports = mongoose.model("User", DealsSchema);
