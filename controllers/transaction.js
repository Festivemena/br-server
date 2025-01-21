const User = require("../models/user");
const Transaction = require("../models/transactions");

const { CustomAPIError } = require("../errors/custom-error");
const asyncWrapper = require("../middleware/async");

const newUserTransaction = asyncWrapper(async (req, res) => {
    const { userTransactionType } = req.query;
    const { txAmount, txMethod } = req.body;

    const user = await User.findById(req.userId);

    // if (userTransactionType == "Withdrawal" && user.accountBalance <= 0) {
    if (userTransactionType == "Withdrawal" && user.accountBalance <= 0) {
        throw new CustomAPIError("Insufficient Account Balance", 400);
    }
    console.log(req.body);
    console.log(req.file);

    if (userTransactionType == "Deposit" && !req.file) {
        throw new CustomAPIError("Please upload a file", 400);
    }

    const filePath =
        userTransactionType == "Deposit" ? req.file.path : "Withdrawal Request";

    if (!["Withdrawal", "Commission", "Deposit"].includes(userTransactionType)) {
        throw new CustomAPIError("Invalid userTransactionType", 400);
    }

    if (!["Bitcoin", "Ethereum", "USDT", "Bank"].includes(txMethod)) {
        throw new CustomAPIError("Invalid txMethod", 400);
    }

    if (txAmount <= 0) {
        throw new CustomAPIError("Amount must be more than zero", 400);
    }

    const newTransaction = new Transaction({
        txAmount,
        txMethod,
        txType: userTransactionType,
        paymentFile: filePath,
    });

    //   console.log(newTransaction);
    newTransaction.userId = req.userId;

    await newTransaction.save();

    const txId = newTransaction._id;

    user.userTransactions[userTransactionType].push(txId);

    await user.save();
    res.status(200).json({
        msg: "Transaction Added",
        plan: newTransaction,
        success: true,
    });
});

module.exports = { newUserTransaction };
