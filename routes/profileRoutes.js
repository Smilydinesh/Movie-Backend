// backend/routes/profileRoutes.js
const express = require('express');
const { authenticate, getProfile } = require('../controllers/profileController');
const router = express.Router();

// Profile route
router.get('/profile', authenticate, getProfile);

module.exports = router;
