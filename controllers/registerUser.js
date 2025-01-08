const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/registerUser'); // Import User model

// Handle user registration with option to create an admin user
const registerUser = async (req, res) => {
  const { name, phoneNo, email, password, isAdmin } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'User already exists' });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance and save to MongoDB
    const newUser = new User({
      name,
      phoneNo,
      email,
      password: hashedPassword,
      isAdmin: isAdmin || false,  // Set isAdmin to true for admin users, default is false
    });

    await newUser.save();

    res.status(201).json({ status: 'ok', message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

// Handle user login (with admin check)
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ status: 'error', message: 'User not found' });
    }

    // Compare provided password with stored password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: 'error', message: 'Invalid credentials' });
    }

    // Check if the user is an admin
    if (user.isAdmin) {
      return res.json({ status: 'ok', message: 'Admin login successful', user });
    } else {
      return res.json({ status: 'ok', message: 'Login successful', user });
    }
  } catch (err) {
    console.error('Error logging in user:', err);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

// Handle forgotten password (email with reset link)
const forgotPassword = async (req, res) => {
  const { email } = req.body;  // Email sent from the frontend

  try {
    // Find the user by the email
    const user = await User.findOne({ email });
    
    // If user is not found, send error response
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Save the reset token in the user record with an expiration time
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    // Construct the reset password URL (replace with actual URL)
    const resetPasswordUrl = `https://movie-backend-939z.onrender.com/user/reset-password/${resetToken}`;

    // Set up email configuration (nodemailer)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'dk2614329@gmail.com',  // Your Gmail address
        pass: 'ebuu wtqv zcuh gjht',   // Your Gmail password or app password
      },
    });

    const mailOptions = {
      to: email,
      from: 'dk2614329@gmail.com',
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click the link below to reset your password:\n\n${resetPasswordUrl}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ msg: 'Failed to send email' });
      }
      res.status(200).json({ msg: 'Password reset link sent!' });
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Admin Authorization Middleware
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId); // Assume req.userId is set after JWT verification
    if (user && user.isAdmin) {
      next(); // Proceed to the next middleware or route
    } else {
      return res.status(403).json({ status: 'error', message: 'Access denied' });
    }
  } catch (err) {
    console.error('Error verifying admin:', err);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

// Admin route to delete a user
const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Check if the logged-in user is an admin
    const adminUser = await User.findById(req.userId); // Assume req.userId is set from JWT token
    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({ status: 'error', message: 'Only admins can perform this action' });
    }

    // Proceed to delete the user
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.status(200).json({ status: 'ok', message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

// Admin route to get all users (example)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ status: 'ok', users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  isAdmin,
  deleteUser,
  getAllUsers,
};
