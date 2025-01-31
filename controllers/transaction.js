const User = require("../models/user");
const Transaction = require("../models/transactions");

const { CustomAPIError } = require("../errors/custom-error");
const asyncWrapper = require("../middleware/async");

const newUserTransaction = asyncWrapper(async (req, res) => {
    const { userTransactionType } = req.query;
    const { txAmount, userId, txMethod } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        throw new CustomAPIError("User not found", 404);
    }

    if (userTransactionType === "Withdrawal" && txAmount > user.accountAffiliateBalance) {
        throw new CustomAPIError("Insufficient Account Balance", 400);
    }

    if (userTransactionType === "Deposit" && !req.file) {
        throw new CustomAPIError("Please upload a file", 400);
    }

    const filePath = userTransactionType === "Deposit" ? req.file.path : "Withdrawal Request";

    if (!["Withdrawal", "Deposit"].includes(userTransactionType)) {
        throw new CustomAPIError("Invalid userTransactionType", 400);
    }

    if (!["Bitcoin", "Ethereum", "USDT", "Bank"].includes(txMethod)) {
        throw new CustomAPIError("Invalid txMethod", 400);
    }

    if (txAmount <= 0) {
        throw new CustomAPIError("Amount must be more than zero", 400);
    }

    const newTransaction = new Transaction({
        user: req.userId, // Reference the user correctly
        txAmount,
        txMethod,
        txType: userTransactionType,
        paymentFile: filePath,
    });

    await newTransaction.save();

    // Add transaction ID to user's transaction history
    user.userTransactions[userTransactionType].push(newTransaction._id);
    await user.save();

    res.status(200).json({
        msg: "Transaction Added",
        plan: newTransaction,
        success: true,
    });
});

module.exports = { newUserTransaction };
