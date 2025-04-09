// backend/sequelize.js
const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database', 'moviemate.db'),
  logging: false, // optional: turns off SQL logging in console
});

module.exports = sequelize;
