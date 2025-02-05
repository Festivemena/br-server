const mongoose = require("mongoose");
const User = require("./user");
const { CustomAPIError } = require("../errors/custom-error");

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Correctly referencing the User model
    required: [true, "Transaction must be linked to a user"],
  },
  txMethod: {
    type: String,
    enum: ["Bitcoin", "Ethereum", "USDT", "Bank"],
    required: [true, "Must specify a transaction method"],
  },
  txAmount: {
    type: Number,
    required: [true, "Transaction amount is required"],
  },
  txStatus: {
    type: String,
    enum: ["Successful", "Pending", "Failed"],
    default: "Pending",
  },
  txType: {
    type: String,
    enum: [
      "Withdrawal",
      "Deposit",
      "Commission",
      "AMC",
      "IMC",
      "Upgrade",
      "Reflection",
      "SwitchTransfer",
      "Distribution",
      "Spread",
      "Recommitment",
    ],
    required: [true, "Must specify a transaction type"],
  },
  paymentFile: {
    type: String, // Optional file upload (e.g., proof of payment)
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to handle user field updates upon successful transactions
TransactionSchema.pre("save", async function (next) {
  try {
    if (this.txType === "Deposit") {
      return next();
    }

    if (!this.user) {
      throw new CustomAPIError("User ID is missing", 400);
    }

    const user = await User.findById(this.user);
    if (!user) {
      throw new CustomAPIError("User not found", 404);
    }

    // Enforce required user conditions before allowing a non-deposit transaction
    const requiredFields = [
      { field: "isMarketingLandscapeIssue", message: "Marketing Landscape issue detected" },
      { field: "isCommissionFeePaid", message: "Commission Fee not paid" },
      { field: "isAccountUpgraded", message: "Your account is due for an upgrade" },
      { field: "isAccountVerified", message: "Account not verified" },
      { field: "isIMCPaid", message: "IMC - Investment Management Charges not paid" },
      { field: "isAccountUpdated", message: "Your Account is due for update" },
      { field: "isAMCPaid", message: "AMC - Account Maintenance Fee not paid" },
      { field: "isSwitchTransferFeePaid", message: "Switch your equity to the account balance" },
      { field: "isReflectionFeePaid", message: "Reflection Fee not paid" },
      { field: "isDistributionFeePaid", message: "Distribution Fee not paid" },
      { field: "isSpreadFeePaid", message: "Spread Fee not paid" }
    ];

    for (const { field, message } of requiredFields) {
      if (!user[field]) {
        throw new CustomAPIError(message, 400);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Export the Transaction model
module.exports = mongoose.model("Transaction", TransactionSchema);
