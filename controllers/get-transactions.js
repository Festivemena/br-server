const mongoose = require("mongoose");
const Transaction = require("../models/transactions");
const User = require("../models/user");

const { CustomAPIError } = require("../errors/custom-error");
const asyncWrapper = require("../middleware/async");

const getTransactions = asyncWrapper(async (req, res, next) => {
  let { txIds } = req.query;
  console.log(txIds);
  txIds = JSON.parse(txIds);

  const txs = await Transaction.find({
    _id: { $in: txIds },
  });

  console.log(txs);

  if (!txs) {
    return next(new CustomAPIError(`No txs with ID: ${txIds}`, 404));
  }
  res.status(200).json({ txs });
});

const modifyUserTransaction = asyncWrapper(async (req, res, next) => {
  const { txID, userID } = req.body;
  const { txStatus } = req.query;
  const tx = await Transaction.findById(txID);

  if (!tx) {
    throw new CustomAPIError("Transaction doesn't exist", 400);
  }

  const user = await User.findById(userID);

  if (!user) {
    throw new CustomAPIError("User doesn't exist", 400);
  }

  if (!["Successful", "Pending", "Failed"].includes(txStatus)) {
    throw new CustomAPIError("Invalid Transaction status", 400);
  }

  if (tx.txStatus == "Pending") {
    if (txStatus == "Successful") {
      user.accountBalance += Number(tx.txAmount);
    }

    tx.txStatus = txStatus;
  }

  await Promise.all([tx.save(), user.save()]);

  res.status(200).json({ success: true, tx, user });
});

module.exports = {
  getTransactions,
  modifyUserTransaction,
};
