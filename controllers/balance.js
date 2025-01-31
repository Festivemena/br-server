const User = require("../models/user");

const updateAffiliateBalance = async (req, res) => {
  const { equity } = req.body; // Extract equity from request body
  const userId = req.user._id; // Assuming user ID is available in the request (e.g., from middleware)

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the affiliate balance
    user.accountAffiliateBalance = equity;

    // Save the updated user
    await user.save();

    // Respond with success message
    res.status(200).json({
      message: "Affiliate balance updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating affiliate balance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = updateAffiliateBalance;