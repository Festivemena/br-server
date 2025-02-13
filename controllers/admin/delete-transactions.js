const Transaction = require("../../models/transactions");
const { CustomAPIError } = require("../../errors/custom-error");
const asyncWrapper = require("../../middleware/async");

const deleteTransactionAdmin = asyncWrapper(async (req, res, next) => {
  const { id: delID } = req.params; // Extract transaction ID from request params

  if (!delID) {
    return res.status(400).json({ msg: "Transaction ID is required" });
  }

  // Check if delID is a valid MongoDB ObjectId
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!objectIdRegex.test(delID)) {
    return res.status(400).json({ msg: "Invalid Transaction ID format" });
  }

  // Find and delete the transaction
  const transaction = await Transaction.findByIdAndDelete(delID);

  if (!transaction) {
    return res.status(404).json({ msg: "Transaction not found" });
  }

  res.status(200).json({ msg: "Transaction deleted successfully" });
});

module.exports = deleteTransactionAdmin;
