const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Importation de la BDD et des routes
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globaux
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Synchronisation de la base de données SQLite (Crée le fichier et les tables automatiquement)
sequelize.sync({ alter: true })
    .then(() => console.log('[DATABASE] Base de données SQLite synchronisée avec succès.'))
    .catch((err) => console.error('[DATABASE] Erreur de synchronisation BDD :', err));

// Liaison des routes d'authentification
app.use('/api/auth', authRoutes);
// Liaison des routes de gestion des tâches (toutes protégées par le middleware d'authentification)
const taskRoutes = require('./routes/tasks');
app.use('/api/tasks', taskRoutes);
// Route de diagnostic
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'API opérationnelle.' });
});

// ====================================================================
// MIDDLEWARE GLOBAL DE GESTION DES ERREURS (Style Défensif - CP 3)
// ====================================================================
app.use((err, req, res, next) => {
    console.error('[ERROR LOG] :', err.stack); // Log complet uniquement visible côté serveur
    
    // Le serveur renvoie une structure d'erreur propre, sans jamais divulguer les détails internes ou SQL au client
    res.status(500).json({
        status: 'error',
        message: 'Une erreur interne est survenue sur le serveur.'
    });
});

app.listen(PORT, () => {
    console.log(`[SERVER] Serveur démarré sur : http://localhost:${PORT}`);
});