const mongoose = require('mongoose');

// Define Movie schema
const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    seats: {
      type: [String], // Store seats as an array of strings (each seat can be represented by its label)
      required: true,
    },
  },
  { timestamps: true }
);

// Create Movie model
const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
