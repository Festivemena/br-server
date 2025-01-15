const User = require("../../models/user");
const Transaction = require("../../models/transactions");

const { CustomAPIError } = require("../../errors/custom-error");
const asyncWrapper = require("../../middleware/async");

// USERS

const modifyTransactionAdmin = asyncWrapper(async (req, res, next) => {
  const { id } = req.query; // Assuming ID comes from URL parameters
  const updateData = req.body; // The fields you want to update

  console.log(id);
  console.log(updateData);

  // Check if ID and update data are provided
  if (!id || !Object.keys(updateData).length) {
    return res
      .status(400)
      .json({ msg: "Transaction ID and update data are required" });
  }

  // Perform the update operation
  const transaction = await Transaction.findByIdAndUpdate(id, updateData, {
    new: true, // Returns the modified document rather than the original
    runValidators: true, // Ensures validations are run on the update operation
  });

  // Check if the transaction was found and updated
  if (!transaction) {
    return res.status(404).json({ msg: "Transaction not found" });
  }

  res.status(200).json({ transaction });
});

module.exports = modifyTransactionAdmin;
