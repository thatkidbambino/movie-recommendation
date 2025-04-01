// backend/routes/movieRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const Movie = require('../models/Movie');

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });
    req.userId = decoded.id;
    next();
  });
};

// Get all movies for user
router.get('/', verifyToken, async (req, res) => {
  try {
    const movies = await Movie.find({ userId: req.userId });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// Add new movie
router.post('/', verifyToken, async (req, res) => {
  const { title, tmdbId, rating } = req.body;
  try {
    const newMovie = new Movie({ title, tmdbId, rating, userId: req.userId });
    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add movie' });
  }
});

// Update movie rating
router.put('/:id', verifyToken, async (req, res) => {
  const { rating } = req.body;
  try {
    const updatedMovie = await Movie.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { rating },
      { new: true }
    );
    if (!updatedMovie) return res.status(404).json({ message: 'Movie not found' });
    res.json(updatedMovie);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update movie' });
  }
});

// Delete movie
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deletedMovie = await Movie.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!deletedMovie) return res.status(404).json({ message: 'Movie not found' });
    res.json({ message: 'Movie deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete movie' });
  }
});

module.exports = router;
