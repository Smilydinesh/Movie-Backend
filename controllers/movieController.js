const Movie = require('../models/movieModel');

// Create a new movie
exports.createMovie = async (req, res) => {
  try {
    const { title, date, time, price, seats } = req.body;

    if (!title || !date || !time || !price || !seats) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const seatArray = seats.split(',').map(seat => seat.trim());

    const newMovie = new Movie({
      title,
      date,
      time,
      price,
      seats: seatArray,
    });

    await newMovie.save();
    res.status(201).json({
      message: 'Movie created successfully',
      movie: newMovie,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating movie' });
  }
};

// Update a movie
exports.updateMovie = async (req, res) => {
  try {
    const { title, date, time, price, seats } = req.body;
    const movieId = req.params.movieId;

    const seatArray = seats.split(',').map(seat => seat.trim());

    const updatedMovie = await Movie.findByIdAndUpdate(
      movieId,
      { title, date, time, price, seats: seatArray },
      { new: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json({
      message: 'Movie updated successfully',
      movie: updatedMovie,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating movie' });
  }
};

// Delete a movie
exports.deleteMovie = async (req, res) => {
  try {
    const movieId = req.params.movieId;

    const deletedMovie = await Movie.findByIdAndDelete(movieId);

    if (!deletedMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting movie' });
  }
};
