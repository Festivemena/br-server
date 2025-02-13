const User = require("../../models/user");
const Transaction = require("../../models/transactions");
const { CustomAPIError } = require("../../errors/custom-error");
const asyncWrapper = require("../../middleware/async");

// USERS

const modifyTransactionAdmin = asyncWrapper(async (req, res, next) => {
  const { txID, userID, txStatus, txType } = req.body; // Extract necessary fields from request body

  console.log(txID, userID, txStatus, txType);

  if (!txID || !txStatus || !txType) {
    return res.status(400).json({ msg: "Transaction ID, status, and type are required" });
  }

  // Find the transaction by ID
  const transaction = await Transaction.findById(txID);
  if (!transaction) {
    return res.status(404).json({ msg: "Transaction not found" });
  }

  // Update transaction status
  transaction.txStatus = txStatus;
  await transaction.save();

  // If transaction is successful, update the user's account balance accordingly
  if (txStatus.toLowerCase() === "successful") {
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (txType.toLowerCase() === "deposit") {
      // Add transaction amount to user's account balance
      user.accountBalance += transaction.txAmount;
      await user.save();
    }
  }

  res.status(200).json({ transaction });
});

module.exports = modifyTransactionAdmin;