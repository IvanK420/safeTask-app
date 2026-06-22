const { Sequelize } = require('sequelize');
require('dotenv').config();

// Initialisation de l'instance Sequelize en mode SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || './database.sqlite',
    logging: false // Désactive les logs SQL bruts dans la console en production pour plus de clarté
});

module.exports = sequelize;