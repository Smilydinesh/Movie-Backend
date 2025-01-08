const mongoose = require('mongoose');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  isAdmin: {  // New field to define if the user is an admin
    type: Boolean,
    default: false,  // Default value is false (non-admin user)
  },
});

// Create a model for the User schema
const User = mongoose.model('User', userSchema);

module.exports = User;
