require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })
    .then(() => console.log('[DATABASE] Base de données SQLite synchronisée avec succès.'))
    .catch((err) => console.error('[DATABASE] Erreur de synchronisation BDD :', err));

app.listen(PORT, () => {
    console.log(`[SERVER] Serveur démarré sur : http://localhost:${PORT}`);
});
