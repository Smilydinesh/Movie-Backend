// const jwt = require("jsonwebtoken");

// const authMiddleware = (req, res, next) => {
//   const token = req.header("Authorization")?.replace("Bearer ", "");

//   if (!token) {
//     return res
//       .status(401)
//       .json({ error: "No token provided, authorization denied!" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;  
//     next();  
//   } catch (error) {
//     console.error("Token verification failed:", error);  
//     if (error.name === "TokenExpiredError") {
//       return res.status(401).json({ error: "Token has expired" });
//     }
//     res.status(400).json({ error: "Invalid token" });
//   }
// };

// module.exports = authMiddleware;

const jwt = require("jsonwebtoken");
const User = require("../models/registerUser");  // Import User model to fetch user data

// Admin Authorization Middleware
const adminMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ error: "No token provided, authorization denied!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Store decoded user information in req.user

    // Fetch the user from the database using the decoded user ID
    const user = await User.findById(req.user.id);

    // Check if the user is an admin
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Token verification failed:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired" });
    }
    res.status(400).json({ error: "Invalid token" });
  }
};

module.exports = adminMiddleware;
