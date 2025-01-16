const Transaction = require("../../models/transactions");

const { CustomAPIError } = require("../../errors/custom-error");
const asyncWrapper = require("../../middleware/async");

const modifyWithdrawalChecklist = asyncWrapper(async (req, res, next) => {
  const updatedData  = req.body;
  const { id } = req.query;

  console.log(updatedData)
  console.log(id)

  const updatedTransaction = await Transaction.findByIdAndUpdate(id, updatedData, {
    new: true, // Returns the modified document rather than the original
    runValidators: true, // Ensures validations are run on the update operation
  });

  if (!updatedTransaction) {
    throw new CustomAPIError("Transaction not found", 404);
  }

  res.status(200).json({ updatedTransaction });
});

module.exports = modifyWithdrawalChecklist;
