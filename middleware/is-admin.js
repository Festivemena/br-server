const jwt = require("jsonwebtoken");
const { CustomAPIError } = require("../errors/custom-error");
const User = require("../models/user");

const isAdmin = async (req, res, next) => {
  const authBearer = req.headers.authorization;

  if (!authBearer || !authBearer.startsWith("Bearer ")) {
    return next(new CustomAPIError("No Token Available", 401));
  }

  const token = authBearer.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return next(new CustomAPIError("User not found", 403));
    }

    if (!user.isAdmin) {
      return next(new CustomAPIError("Admin access only", 403));
    }

    next();
  } catch (error) {
    console.error("Admin access verification failed:", error);
    return next(
      new CustomAPIError("Forbidden - Admin access required", 403)
    );
  }
};

// const isAdmin = async (req, res, next) => {
//   const authBearer = req.headers.authorization;

//   if (!authBearer || !authBearer.startsWith("Bearer ")) {
//     throw new CustomAPIError("No Token Available", 401);
//   }

//   const token = authBearer.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("decoded", decoded);
//     const { userId } = decoded;

//     const user = await User.findById(userId);

//     if (!user) {
//       throw new CustomAPIError("Who Are You?!", 403);
//     }

//     if (!user.isAdmin) {
//       throw new CustomAPIError("Admin access only", 403);
//     }

//     next();
//   } catch (error) {
//     console.log("AD=dmin Error", error);
//     throw new CustomAPIError(
//       "Forbidden - Admin access required",
//       403
//     );
//   }
// };

// module.exports = isAdmin;

// const jwt = require("jsonwebtoken");
// const { CustomAPIError } = require("../errors/custom-error");
// const User = require("../models/user");

// const isAdmin = async (req, res, next) => {
//   if (!req.userId) {
//     throw new CustomAPIError("No User ID Provided", 401);
//   }

//   try {
//     const user = await User.findById(req.userId);

//     console.log("Admin decoded", req.userId);

//     if (!user) {
//       throw new CustomAPIError("User not found", 403);
//     }

//     if (!user.isAdmin) {
//       throw new CustomAPIError("Admin access only", 403);
//     }

//     next(); // continue if user is admin
//   } catch (error) {
//     console.error("Admin access verification failed:", error);
//     throw new CustomAPIError(
//       "Forbidden - Admin access required",
//       403
//     );
//   }
// };

module.exports = isAdmin;
