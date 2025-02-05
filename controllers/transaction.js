const User = require("../models/user");
const Transaction = require("../models/transactions");

const { CustomAPIError } = require("../errors/custom-error");
const asyncWrapper = require("../middleware/async");

const newUserTransaction = asyncWrapper(async (req, res) => {
  const { userTransactionType } = req.query;
  const { txAmount, txMethod } = req.body;

  const user = await User.findById(req.userId);

  // Check for insufficient balance in case of withdrawal
  if (userTransactionType === "Withdrawal") {
    if (txAmount > user.accountAffiliateBalance) {
      throw new CustomAPIError("Insufficient Account Balance", 400);
    }
  }

  // Validate transaction type
  if (!["Withdrawal",
      "Deposit",
      "Commission",
      "AMC",
      "IMC",
      "Upgrade",
      "Reflection",
      "SwitchTransfer",
      "Distribution",
      "Spread",
      "Recommitment"].includes(userTransactionType)) {
    throw new CustomAPIError("Invalid userTransactionType", 400);
  }

  // Validate transaction method
  if (!["Bitcoin", "Ethereum", "USDT", "Bank"].includes(txMethod)) {
    throw new CustomAPIError("Invalid txMethod", 400);
  }

  // Validate transaction amount
  if (txAmount <= 0) {
    throw new CustomAPIError("Amount must be more than zero", 400);
  }

  // Create a new transaction
  const newTransaction = new Transaction({
    txAmount,
    txMethod,
    txType: userTransactionType,
    paymentFile: null, // No file upload, so set to null or remove this field entirely
    user: req.userId, // Ensure this matches the schema field name
  });

  await newTransaction.save();

  const txId = newTransaction._id;

  // Add transaction ID to the user's transaction history
  user.userTransactions[userTransactionType].push(txId);

  // Save the updated user balance and transaction history
  await user.save();

  // Send response
  res.status(200).json({
    msg: "Transaction Added",
    plan: newTransaction,
    success: true,
  });
});

module.exports = { newUserTransaction };
