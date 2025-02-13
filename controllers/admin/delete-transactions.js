const Transaction = require("../../models/transactions");
const { CustomAPIError } = require("../../errors/custom-error");
const asyncWrapper = require("../../middleware/async");

const deleteTransactionAdmin = asyncWrapper(async (req, res, next) => {
  const { txID } = req.params; // Extract transaction ID from request body

  if (!txID) {
    return res.status(400).json({ msg: "Transaction ID is required" });
  }

  // Find and delete the transaction
  const transaction = await Transaction.findByIdAndDelete(txID);
  
  if (!transaction) {
    return res.status(404).json({ msg: "Transaction not found" });
  }

  res.status(200).json({ msg: "Transaction deleted successfully" });
});

module.exports = deleteTransactionAdmin;
