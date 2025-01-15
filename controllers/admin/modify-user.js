const User = require("../../models/user");
const { CustomAPIError } = require("../../errors/custom-error");
const asyncWrapper = require("../../middleware/async");

const modifyUserAdmin = asyncWrapper(async (req, res, next) => {
  const updatedData = req.body;
  const { id } = req.params;

  const userData = await User.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });

  if (!userData) {
    return next(new CustomAPIError(`User not found: ${id}`, 404));
  }

  res.status(200).json({ userData });
});

module.exports = modifyUserAdmin;
