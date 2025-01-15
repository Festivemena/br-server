const Transaction = require("../../models/transactions");
const User = require("../../models/user");
const { CustomAPIError } = require("../../errors/custom-error");
const asyncWrapper = require("../../middleware/async");

const getUserTransactionAdmin = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return next(new CustomAPIError(`user not found: ${id}`, 404));
  }

  const { userTransactions } = user;

  const allTransactionIds = [
    ...userTransactions.Deposit,
    ...userTransactions.Withdrawal,
  ];

  if (allTransactionIds.length === 0) {
    // Handle alternative response when allTransactionIds is empty
    return res
      .status(200)
      .json({
        allTransactions: [],
        message: "No transactions found for this user",
      });
  }

  const allTransactions = await Transaction.find({
    _id: { $in: allTransactionIds },
  });

  console.log(allTransactions);

  res.status(200).json({ allTransactions });
});

module.exports = getUserTransactionAdmin;
