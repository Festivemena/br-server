const User = require("../models/user");
const Transaction = require("../models/transactions");
const { CustomAPIError } = require("../errors/custom-error");
const asyncWrapper = require("../middleware/async");

const newUserTransaction = asyncWrapper(async (req, res) => {
  const { userTransactionType } = req.query;
  const { txAmount, txMethod } = req.body;

  // Validate input
  if (!userTransactionType || !txAmount || !txMethod) {
    throw new CustomAPIError("Missing required fields", 400);
  }

  const user = await User.findById(req.userId);
  if (!user) {
    throw new CustomAPIError("User not found", 404);
  }

  // List of valid transaction types
  const validTransactionTypes = [
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
    "Recommitment"
  ];

  // List of valid transaction methods
  const validTxMethods = ["Bitcoin", "Ethereum", "USDT", "Bank"];

  // Validate transaction type
  if (!validTransactionTypes.includes(userTransactionType)) {
    throw new CustomAPIError("Invalid userTransactionType", 400);
  }

  // Validate transaction method
  if (!validTxMethods.includes(txMethod)) {
    throw new CustomAPIError("Invalid txMethod", 400);
  }

  // Validate transaction amount
  if (txAmount <= 0) {
    throw new CustomAPIError("Amount must be more than zero", 400);
  }

  // Check for insufficient balance in case of withdrawal
  if (userTransactionType === "Withdrawal" && txAmount > user.accountAffiliateBalance) {
    throw new CustomAPIError("Insufficient Account Balance", 400);
  }

  // Create a new transaction
  const newTransaction = new Transaction({
    txAmount,
    txMethod,
    txType: userTransactionType,
    paymentFile: null, // No file upload, so set to null
    user: req.userId,
  });

  await newTransaction.save();
  const txId = newTransaction._id;

  // Add transaction ID to the user's transaction history
  if (!user.userTransactions[userTransactionType]) {
    user.userTransactions[userTransactionType] = [];
  }
  user.userTransactions[userTransactionType].push(txId);

  // Update user balance based on transaction type
  if (userTransactionType === "Deposit") {
    user.pendingBalance += txAmount;
  } else if (userTransactionType === "Withdrawal") {
    const newBalance = user.accountAffiliateBalance - txAmount;
    user.balance = newBalance;
  }

  await user.save();

  // Send response
  res.status(200).json({
    msg: "Transaction Added Successfully",
    transaction: newTransaction,
    success: true,
  });
});

module.exports = { newUserTransaction };
