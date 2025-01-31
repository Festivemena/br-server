const User = require("./models/User"); // Import the User model

// Controller to update the accountAffiliateBalance
const updateAffiliateBalance = async (req, res) => {
  const { userId } = req.params; // Extract userId from request parameters
  const { equity } = req.body; // Extract equity from request body

  try {
    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the accountAffiliateBalance with the new equity value
    user.accountAffiliateBalance = equity;

    // Save the updated user document
    await user.save();

    // Respond with success message and updated user data
    res.status(200).json({
      message: "Affiliate balance updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating affiliate balance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { updateAffiliateBalance };