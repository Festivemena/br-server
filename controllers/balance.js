const User = require("../models/user");
const asyncWrapper = require("../middleware/async");

const updateAffiliateBalance = asyncWrapper(async (req, res) => {
  const { equity } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized request" });
  }

  if (!equity || isNaN(equity)) {
    return res.status(400).json({ message: "Invalid equity value" });
  }

  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.accountAffiliateBalance = Number(equity);
    await user.save();

    res.status(200).json({
      message: "Affiliate balance updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating affiliate balance:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


module.exports = {
    updateAffiliateBalance,
  };
