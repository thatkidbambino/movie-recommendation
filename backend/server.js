// backend/server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('./sequelize');
const User = require('./models/User');
const Movie = require('./models/Movie');

const app = express();
app.use(cors());
app.use(express.json());

// Sync Database
sequelize
  .sync()
  .then(() => console.log('Database synced'))
  .catch((err) => console.error('Sync error:', err));

// Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });
    req.userId = decoded.id;
    next();
  });
};

// Routes
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser)
      return res.status(400).json({ message: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, 'your_jwt_secret', {
      expiresIn: '1d',
    });
    res.json({ token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/movies', authenticateToken, async (req, res) => {
  try {
    const movies = await Movie.findAll({ where: { UserId: req.userId } });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

app.post('/api/movies', authenticateToken, async (req, res) => {
  const { title, tmdbId, rating } = req.body;
  try {
    const newMovie = await Movie.create({
      title,
      tmdbId,
      rating,
      UserId: req.userId,
    });
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add movie' });
  }
});

app.put('/api/movies/:id', authenticateToken, async (req, res) => {
  const { rating } = req.body;
  try {
    const movie = await Movie.findOne({
      where: { id: req.params.id, UserId: req.userId },
    });
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    movie.rating = rating;
    await movie.save();
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update movie' });
  }
});

app.delete('/api/movies/:id', authenticateToken, async (req, res) => {
  try {
    const result = await Movie.destroy({
      where: { id: req.params.id, UserId: req.userId },
    });
    if (!result) return res.status(404).json({ message: 'Movie not found' });
    res.json({ message: 'Movie deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete movie' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
