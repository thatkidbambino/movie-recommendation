// backend/sequelize.js
const { Sequelize } = require('sequelize');
const path = require('path');
const betterSqlite3 = require('better-sqlite3'); // ✅ Add this line

const sequelize = new Sequelize({
  dialect: 'sqlite',
  dialectModule: betterSqlite3, // ✅ Use better-sqlite3 instead of sqlite3 bindings
  storage: path.join(__dirname, 'database', 'moviemate.db'),
});

module.exports = sequelize;
