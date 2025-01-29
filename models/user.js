const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const countries = require("../utils/countries");
const niches = require("../utils/niches");

const UserSchema = new mongoose.Schema({
  accountEmail: {
    type: String,
    required: [true, "Must provide email"],
    trim: true,
    maxlength: [45, "email cannot be more than 45 characters"],
    unique: [true, "email already exists"],
  },
  fullName: {
    type: String,
    trim: true
  },
  accountPassword: {
    type: String,
    required: [true, "Must provide password"],
    maxlength: [90, "password cannot be more than 90 characters"],
  },
  accountPhoneNumber: {
    type: Number,
    required: [true, "Must provide Phone Number"],
    unique: [true, "phone already exists"],
  },
  accountCountry: {
    type: String,
    enum: countries,
    required: [true, "Must provide Country"],
  },
  accountCurrency: {
    type: String,
    enum: ["USD", "EUR", "GBP"],
    required: [true, "Must provide Currency"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  refID: {
    type: Number,
    unique: [true, "Unique refID needed"],
    required: [true, "refID needed"],
  },
  resetPasswordToken: { type: String, default: "" },
  resetPasswordExpires: { type: Date, default: Date.now },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationDate: { type: Date, default: Date.now },
  emailVerificationToken: { type: String, default: "" },
  emailVerificationTokenExpires: { type: Date, default: Date.now },
  accountNiche: { type: String, enum: niches, default: "" },
  accountNicheStatus: {
    type: String,
    enum: ["Inactive", "Pending", "Active"],
    default: "Inactive",
  },
  accountSmartLink: {
    type: String,
    enum: ["Inactive", "Pending", "Active"],
    default: "Inactive",
  },
  accountGiftBoxStatus: {
    type: String,
    enum: ["Inactive", "Pending", "Active"],
    default: "Inactive",
  },
  accountSmartLinkAmount: { type: Number, default: 0 },
  accountAdvert: {
    type: String,
    enum: ["Inactive", "Pending", "Active"],
    default: "Inactive",
  },
  accountAdvertAmount: { type: Number, default: 0 },
  accountBalance: { type: Number, default: 0 },
  commissionFee: { type: Number, default: 0 },
  upgradeFee: { type: Number, default: 0 },
  imcFee: { type: Number, default: 0 },
  updateFee: { type: Number, default: 0 },
  amcFee: { type: Number, default: 0 },
  reflectionFee: { type: Number, default: 0 },
  switchTransferFee: { type: Number, default: 0 },
  distributionFee: { type: Number, default: 0 },
  spreadFee: { type: Number, default: 0 },
  recommitmentFee: { type: Number, default: 0 },
  accountAffiliateBalance: { type: Number, default: 0 },
  accountAffiliateCapital: { type: Number, default: 0 },
  accountAffiliateEquity: { type: Number, default: 0 },
  accountTotalWithdrawal: { type: Number, default: 0 },
  isAdmin: { type: Boolean, default: false },
  isAccountVerified: { type: Boolean, default: false },
  isMarketingLandscapeIssue: { type: Boolean, default: false },
  isCommissionFeePaid: { type: Boolean, default: false },
  isAccountUpgraded: { type: Boolean, default: false },
  isIMCPaid: { type: Boolean, default: false },
  isAccountUpdated: { type: Boolean, default: false },
  isAMCPaid: { type: Boolean, default: false },
  isEquityAvailable: { type: Boolean, default: false },
  isReflectionFeePaid: { type: Boolean, default: false },
  isSwitchTransferFeePaid: { type: Boolean, default: false },
  isDistributionFeePaid: { type: Boolean, default: false },
  isSpreadFeePaid: { type: Boolean, default: false },
  isRecommitmentFeePaid: { type: Boolean, default: false },
  isMegaResalesAvailable: { type: Boolean, default: false },
  isMegaResalesPopup: { type: Boolean, default: false },
  isMegaResalesGoldPopup: { type: Boolean, default: false },
  isMegaResalesPremiumPopup: { type: Boolean, default: false },
  isMegaResalesVIPPopup: { type: Boolean, default: false },
  isLowPerformancePopup: { type: Boolean, default: false },
  isUpgradeTimePopup: { type: Boolean, default: false },
  isAccountVerificationPopup: { type: Boolean, default: false },
  isUndergoingMaintenancePopup: { type: Boolean, default: false },
  isReflectionFeePopup: { type: Boolean, default: false },
  megaResalePlans: { type: Array, default: [] },
  selectedPlans: {
    BasicGrowthPlan: [],
    StarterGrowthPlan: [],
    BronzeGrowthPlan: [],
    GoldGrowthPlan: [],
    PremiumGrowthPlan: [],
    GoldVIPPlan: [],
  },
  userTransactions: {
    Deposit: [],
    Withdrawal: [],
  },
  userReferrals: { type: Array, default: [] },
});

UserSchema.pre("save", async function (next) {
  try {
    if (
      !this.accountPassword.startsWith("$2b$") &&
      !this.accountPassword.startsWith("$2a$")
    ) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.accountPassword, salt);
      this.accountPassword = hashedPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.accountPassword);
};

module.exports = mongoose.model("User", UserSchema);
