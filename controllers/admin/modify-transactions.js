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
      try {
        // Add pending balance to account balance
        user.accountBalance = Number(user.accountBalance) + Number(user.pendingBalance);

        // Reset pending balance to 0
        user.pendingBalance = 0;

        await user.save();
        console.log("Deposit successful!");
      } catch (error) {
        console.error("Error saving user data:", error);
        return res.status(500).json({ msg: "Internal server error" });
      }
    }
  }

  res.status(200).json({ transaction });
});

module.exports = modifyTransactionAdmin;
