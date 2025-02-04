const User = require("../../models/user");
const Transaction = require("../../models/transactions");
const { CustomAPIError } = require("../../errors/custom-error");
const asyncWrapper = require("../../middleware/async");

// USERS

const modifyTransactionAdmin = asyncWrapper(async (req, res, next) => {
  const { txID, userID, txStatus } = req.body; // Extract necessary fields from request body

  console.log(txID, userID, txStatus);

  if (!txID || !txStatus) {
    return res.status(400).json({ msg: "Transaction ID and status are required" });
  }

  // Find the transaction by ID
  const transaction = await Transaction.findById(txID);
  if (!transaction) {
    return res.status(404).json({ msg: "Transaction not found" });
  }

  // Update transaction status
  transaction.txStatus = txStatus;
  await transaction.save();

  // If transaction is successful, debit the user's affiliate balance
  if (txStatus.toLowerCase() === "successful") {
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Ensure user has sufficient balance
    if (user.affiliateBalance < transaction.txAmount) {
      return res.status(400).json({ msg: "Insufficient affiliate balance" });
    }

    // Deduct transaction amount from user's affiliate balance
    user.affiliateBalance -= transaction.txAmount;
    await user.save();
  }

  res.status(200).json({ transaction });
});

module.exports = modifyTransactionAdmin;
