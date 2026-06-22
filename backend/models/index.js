const sequelize = require('../config/db');
const User = require('./User');
const Task = require('./Task');

// Définition des relations métier (Cardinalités)
User.hasMany(Task, { onDelete: 'CASCADE' }); // Si un utilisateur est supprimé, ses tâches le sont aussi
Task.belongsTo(User);

module.exports = {
    sequelize,
    User,
    Task
};