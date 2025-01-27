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
