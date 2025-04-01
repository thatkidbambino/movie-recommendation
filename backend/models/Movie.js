// backend/models/Movie.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const User = require('./User');

const Movie = sequelize.define('Movie', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tmdbId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

Movie.belongsTo(User);
User.hasMany(Movie);

module.exports = Movie;