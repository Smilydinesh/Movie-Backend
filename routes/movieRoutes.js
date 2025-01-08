const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

// Route to create a new movie
router.post('/movies', movieController.createMovie);

// Route to update an existing movie
router.put('/movies/:movieId', movieController.updateMovie);

// Route to delete a movie
router.delete('/movies/:movieId', movieController.deleteMovie);

module.exports = router;
