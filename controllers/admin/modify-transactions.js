const User = require("../../models/user");
const Transaction = require("../../models/transactions");

const { CustomAPIError } = require("../../errors/custom-error");
const asyncWrapper = require("../../middleware/async");

// USERS

const modifyTransactionAdmin = asyncWrapper(async (req, res, next) => {
  const { txID, userID } = req.body; // Assuming txID and userID come from the request body
  const { txStatus } = req.body; // The fields you want to update

  console.log(txID);
  console.log(userID);
  console.log(txStatus);

  // Check if txID and txStatus are provided
  if (!txID || !txStatus) {
    return res
      .status(400)
      .json({ msg: "Transaction ID and status are required" });
  }

  // Perform the update operation
  const transaction = await Transaction.findByIdAndUpdate(
    txID,
    { txStatus },
    {
      new: true, // Returns the modified document rather than the original
      runValidators: true, // Ensures validations are run on the update operation
    }
  );

  // Check if the transaction was found and updated
  if (!transaction) {
    return res.status(404).json({ msg: "Transaction not found" });
  }

  res.status(200).json({ transaction });
});

module.exports = modifyTransactionAdmin;
