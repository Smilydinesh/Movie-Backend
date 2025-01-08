const express = require('express');
const { registerUser, loginUser, forgotPassword } = require('../controllers/registerUser'); // Import controller

const router = express.Router();

// POST route for registering a user
router.post('/register', registerUser);

// POST route for logging in a user
router.post('/login', loginUser);

router.post('/forgot-password', forgotPassword);

module.exports = router;
