const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const connectDB = require("./config/dbConfig");
const axios = require('axios');
const registerRoutes = require("./routes/registerUser");
const cors = require("cors");
const profileRoutes = require('./routes/profileRoutes');
const movieRoutes = require('./routes/movieRoutes');

require("dotenv").config();

const app = express();

// Enable CORS for the Netlify domain
app.use(cors({
  origin: 'https://thunderous-tanuki-60fad9.netlify.app', // Allow requests from your Netlify frontend
}));
app.use(cors({origin: "https://serene-pithivier-0a0755.netlify.app/"}))
app.use(express.json());  

connectDB();

const API_KEY = '032d06682ca556273b286decb6b17cf2';  // TMDb API key
const BASE_URL = 'https://api.themoviedb.org/3';

app.get('/api/searchMovies', async (req, res) => {
  const searchQuery = req.query.query;  // Get the search term from query parameters
  if (!searchQuery) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }
  
  try {
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        query: searchQuery,
        language: 'en-US',
        page: 1,
      },
    });
    console.log("API Response:", response.data);
    return res.json(response.data);
    // console.log(response.data);  // Send the movie search results back to the client
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching movies');
  }
});

// Fetch top-rated movies
app.get('/api/top-rated', async (req, res) => {
  try {
    const topRated = await axios.get(`${BASE_URL}/movie/top_rated`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
        page: 1
      }
    });
    res.json(topRated.data.results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from TMDb' });
  }
});

// Fetch now-playing movies
app.get('/api/now-playing', async (req, res) => {
  try{
    const nowPlaying = await axios.get(`${BASE_URL}/movie/now_playing`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
        page: 1
      }
    });
    res.json(nowPlaying.data.results);
  }
  catch(error) {
    res.status(500).json({ error: 'Failed to fetch data from TMDb' });
  }
});

// Fetch upcoming movies
app.get('/api/up-coming', async (req, res) => {
  try{
    const upComing = await axios.get(`${BASE_URL}/movie/upcoming`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
        page: 1
      }
    });
    res.json(upComing.data.results);
  } catch(error) {
    res.status(500).json({ error: 'Failed to fetch data from TMDb' });
  }
});

// Fetch popular movies
app.get('/api/popular', async (req, res) => {
  try{
    const popularMovies = await axios.get(`${BASE_URL}/movie/popular`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
        page: 1
      }
    });
    res.json(popularMovies.data.results);
  }
  catch(error) {
    res.status(500).json({ error: 'Failed to fetch data from TMDb' });
  }
});

// Fetch TV shows
app.get('/api/tv-shows', async (req, res) => {
  try{
    const tvShows = await axios.get(`${BASE_URL}/discover/tv`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
        page: 1
      }
    });
    res.json(tvShows.data.results);
  }
  catch(error) {
    res.status(500).json({ error: 'Failed to fetch data from TMDb' });
  }
});

app.use("/user", registerRoutes);

app.use('/api', profileRoutes);

app.use('/api', movieRoutes);

// The following duplicate routes can be removed or refactored to avoid redundancy:
app.get('/get', async (req, res) => {
  const toprated = await axios('https://api.themoviedb.org/3/movie/top_rated', {
    method: 'GET'
  });
  const data = await toprated.json();
  res.json(data);
});

app.get('/get', async (req, res) => {
  const searchdetails = await axios('https://api.themoviedborg/3/discover/movie', {
    method: 'GET'
  });
  const data = await searchdetails.json();
  res.json(data);
});

// Example of potential other routes with redundant structure removed
app.get('/get', async (req, res) => {
  const nowplaying = await axios('https://api.themoviedb.org/3/movie/now_playing', {
    method: 'GET'
  });
  const data = await nowplaying.json();
  res.json(data);
});

app.get('/get', async (req, res) => {
  const upcoming = await axios('https://api.themoviedb.org/3/movie/upcoming', {
    method: 'GET'
  });
  const data = await upcoming.json();
  res.json(data);
});

app.get('/get', async (req, res) => {
  const popular = await axios('https://api.themoviedb.org/3/movie/popular', {
    method: 'GET'
  });
  const data = await popular.json();
  res.json(data);
});

app.get('/get', async (req, res) => {
  const tvshows = await axios('https://api.themoviedb.org/3/discover/tv', {
    method: 'GET'
  });
  const data = await tvshows.json();
  res.json(data);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("Missing essential environment variables: MONGO_URI or JWT_SECRET");
  process.exit(1); 
}
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

