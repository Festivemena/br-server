const mongoose = require("mongoose");
const User = require("../models/user");
const MegaResalesPlan = require("../models/vip-plans/mega-resales");
const { CustomAPIError } = require("../errors/custom-error");
const asyncWrapper = require("../middleware/async");

const addMegaResalesPlan = asyncWrapper(async (req, res) => {
  const { userAmount } = req.body;
  console.log(req.body);

  const user = await User.findById(req.userId);

  if (!user) {
    throw new CustomAPIError("Can't find User", 400);
  }

  if (
    user.accountBalance <= 0 ||
    user.accountBalance < Number(userAmount)
  ) {
    throw new CustomAPIError("Insufficient Balance to Invest", 400);
  }

  if (Number(userAmount) <= 0) {
    throw new CustomAPIError("Amount must be more than zero", 400);
  }

  console.log(user);
  const newPlan = new MegaResalesPlan({
    investAmount: userAmount,
    fullName: String(user.fullName),
  });

  const validationError = newPlan.validateSync();
  console.log(validationError);

  if (validationError) {
    console.log(validationError.errors["investAmount"].message);
    throw new CustomAPIError("Amount out of Range", 400);
  }

  await newPlan.save();
  await newPlan.updateCurrentAmount();

  const planId = newPlan._id;

  user.accountBalance -= Number(userAmount);

  user.megaResalePlans.push(planId);

  await user.save();
  res
    .status(200)
    .json({ msg: "Successfully invested", plan: newPlan, user });
  // .json({ msg: "Successfully invested"});
});

const getMegaResalesPlan = asyncWrapper(async (req, res) => {
  const user = await User.findById(req.userId);

  if (!user) {
    throw new CustomAPIError("Access Unavailable, Login", 400);
  }

  if (user.megaResalePlans.length < 1) {
    // throw new CustomAPIError("No Mega Resale Plans Available", 400);
    return res.status(203).json({
      MRP: [],
    });
  }

  const userMRP = await MegaResalesPlan.find({
    _id: { $in: user.megaResalePlans },
  });

  let mMRP = [];

  for (const userMRPDocument of userMRP) {
    const model = await MegaResalesPlan.findById(userMRPDocument._id);
    await model.getCurrentAmount();

    mMRP.push(model);
  }

  // await userMRP.getCurrentAmount()
  // let resPlan = await mongoose.model(userMRP);
  // await resPlan.getCurrentAmount();

  if (!userMRP) {
    throw new CustomAPIError("Couldn't get MRP", 400);
  }

  res.status(200).json({
    // MRP: userMRP,
    MRP: mMRP,
    // resPlan
  });
});

module.exports = { addMegaResalesPlan, getMegaResalesPlan };
