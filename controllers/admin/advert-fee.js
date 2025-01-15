const User = require("../../models/user");
const { CustomAPIError } = require("../../errors/custom-error");
const asyncWrapper = require("../../middleware/async");

const modifyAdvertFee = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { status = "Active", amount = 600 } = req.body;

  const user = await User.findById(id);

  if (!user) {
    return next(
      new CustomAPIError(`No user with ID: ${req.userId}`, 404)
    );
  }

  user.accountAdvert = status;
  user.accountAdvertAmount = amount;
  await user.save();

  res.status(200).json({ user });
});

module.exports = modifyAdvertFee;
