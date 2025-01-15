const User = require("../../models/user");
const Transaction = require("../../models/transactions");

const { CustomAPIError } = require("../../errors/custom-error");
const asyncWrapper = require("../../middleware/async");

// USERS

const getTransactionAdmin = asyncWrapper(async (req, res, next) => {
  const transactions = await Transaction.find({});

  res.status(200).json({ transactions });
});

module.exports = getTransactionAdmin;
