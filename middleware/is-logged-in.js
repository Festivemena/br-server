const jwt = require("jsonwebtoken");
const { CustomAPIError } = require("../errors/custom-error");

const isLoggedIn = async (req, res, next) => {
  const authBearer = req.headers.authorization;

  if (!authBearer || !authBearer.startsWith("Bearer ")) {
    throw new CustomAPIError("No Token Available", 401);
  }

  const token = authBearer.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Attach userId to the request for downstream use
    console.log("User decoded", decoded);
    next();
  } catch (error) {
    console.error("Login verification failed:", error);
    // throw new CustomAPIError(
    //   "Forbidden - You have to be logged in",
    //   403
    // );
    next(
      new CustomAPIError("Forbidden - You have to be logged in", 403)
    );
  }
};

module.exports = isLoggedIn;
