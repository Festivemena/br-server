const jwt = require("jsonwebtoken");
const asyncWrapper = require("../middleware/async");

require("dotenv").config();

const verifyUser = asyncWrapper((req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    // Token is valid
    res.status(200).json({ message: "Token is valid", decoded });
  });
});

module.exports = verifyUser;
