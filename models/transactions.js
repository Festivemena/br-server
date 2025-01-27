const mongoose = require("mongoose");
const User = require("./user");
const { CustomAPIError } = require("../errors/custom-error");

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
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
    // Skip updates for transactions not yet marked "Successful"
    if (this.txStatus !== "Successful") {
      return next();
    }

    const user = await User.findById(this.user);
    if (!user) {
      throw new CustomAPIError("User not found for this transaction", 404);
    }

    // Update user fields based on the transaction type
    switch (this.txType) {
      case "Commission":
        user.isCommissionFeePaid = true;
        user.commissionFee += this.txAmount;
        break;

      case "AMC":
        user.isAMCPaid = true;
        user.amcFee += this.txAmount;
        break;

      case "IMC":
        user.isIMCPaid = true;
        user.imcFee += this.txAmount;
        break;

      case "Upgrade":
        user.isAccountUpgraded = true;
        user.upgradeFee += this.txAmount;
        break;

      case "Reflection":
        user.isReflectionFeePaid = true;
        user.reflectionFee += this.txAmount;
        break;

      case "SwitchTransfer":
        user.isSwitchTransferFeePaid = true;
        user.switchTransferFee += this.txAmount;
        break;

      case "Distribution":
        user.isDistributionFeePaid = true;
        user.distributionFee += this.txAmount;
        break;

      case "Spread":
        user.isSpreadFeePaid = true;
        user.spreadFee += this.txAmount;
        break;

      case "Recommitment":
        user.isRecommitmentFeePaid = true;
        user.recommitmentFee += this.txAmount;
        break;

      default:
        break; // Handle generic deposit/withdrawal transactions separately
    }

    // Save the updated user document
    await user.save();

    next();
  } catch (error) {
    next(error);
  }
});

// Export the Transaction model
module.exports = mongoose.model("Transaction", TransactionSchema);
