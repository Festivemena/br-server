const User = require("../models/user");
const Transaction = require("../models/transactions");

const { CustomAPIError } = require("../errors/custom-error");
const asyncWrapper = require("../middleware/async");

const newUserTransaction = asyncWrapper(async (req, res) => {
    const { userTransactionType } = req.query;
    const { txAmount, userId, txMethod } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
        throw new CustomAPIError("User not found", 404);
    }

    // Check for insufficient balance in case of withdrawal
    if (userTransactionType === "Withdrawal" && txAmount > user.accountAffiliateBalance) {
        throw new CustomAPIError("Insufficient Account Balance", 400);
    }

    // Validate transaction type
    if (!["Withdrawal", "Deposit"].includes(userTransactionType)) {
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
        user: userId, // Reference the user correctly
        txAmount,
        txMethod,
        txType: userTransactionType,
        paymentFile: "N/A", // No file upload, so set to "N/A" or any placeholder
    });

    // Save the transaction to the database
    await newTransaction.save();

    // Add transaction ID to user's transaction history
    user.userTransactions[userTransactionType].push(newTransaction._id);
    await user.save();

    // Respond with success message
    res.status(200).json({
        msg: "Transaction Added",
        transaction: newTransaction,
        success: true,
    });
});

module.exports = { newUserTransaction };
