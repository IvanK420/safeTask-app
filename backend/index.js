const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config(); // Charge les variables du fichier .env

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// MIDDLEWARES DE SÉCURITÉ & CONFIGURATION (Validation CP 1)
// ==========================================

// 1. Protection des en-têtes HTTP
app.use(helmet()); 

// 2. Contrôle des accès CORS (Restreint l'accès uniquement à votre futur Front React)
app.use(cors({
    origin: 'http://localhost:5173', // Port par défaut de Vite
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// 3. Analyse syntaxique du corps des requêtes (remplace body-parser)
app.use(express.json());

// ==========================================
// ROUTE DE TEST / SANTÉ DE L'API
// ==========================================
app.get('/api/health', (req, res) => {
    try {
        res.status(200).json({ 
            status: 'success', 
            message: 'Le serveur SafeTask répond correctement.' 
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Erreur interne du serveur' });
    }
});

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`[SERVER] Serveur sécurisé démarré sur : http://localhost:${PORT}`);
});