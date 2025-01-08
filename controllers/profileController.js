// backend/controllers/profileController.js
const jwt = require('jsonwebtoken');
const User = require('../models/registerUser');

// Middleware to authenticate user via JWT token
const authenticate = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, 'your_secret_key');
    req.user = decoded.userId;  // Attach the user ID to the request object
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

// Controller to fetch user profile
const getProfile = async (req, res) => {
  try {
    // Find the user by ID
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user profile data
    res.json({
      name: user.name,
      email: user.email,
      // Add any other user profile information you want to return
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { authenticate, getProfile };
