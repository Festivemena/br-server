const User = require("../models/user");
const MegaResalesPlan = require("../models/vip-plans/mega-resales");
const { CustomAPIError } = require("../errors/custom-error");
const asyncWrapper = require("../middleware/async");

const getAllMegaResalesPlan = asyncWrapper(async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) {
    throw new CustomAPIError("Can't find User", 400);
  }
  const MRPlans = await MegaResalesPlan.find({});

  res.status(200).json({
    MRPlans,
    fullName: user.fullName,
  });
});

module.exports = { getAllMegaResalesPlan };
