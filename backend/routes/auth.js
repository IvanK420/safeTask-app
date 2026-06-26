const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { User } = require('../models');

// ANSSI PA-079 : limiter les tentatives d'authentification (brute force)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // fenêtre de 15 minutes
    max: 10,                   // 10 tentatives max par IP
    standardHeaders: true,     // renvoie les headers RateLimit-* standard
    legacyHeaders: false,
    message: { error: 'Trop de tentatives. Veuillez réessayer dans 15 minutes.' }
});

// ====================================================================
// ROUTE : Inscription (POST /api/auth/register)
// ====================================================================
router.post('/register', authLimiter, async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1. Programmation défensive : Vérification de la présence des données
        if (!email || !password) {
            return res.status(400).json({ error: 'Veuillez remplir tous les champs obligatoires.' });
        }

        // 2. Vérification si l'utilisateur existe déjà
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
        }

        // 3. Sécurité (ANSSI) : Hachage du mot de passe (10 passes de salage)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 4. Persistance en BDD via l'ORM
        const newUser = await User.create({
            email,
            password: hashedPassword
        });

        res.status(201).json({ 
            message: 'Utilisateur créé avec succès.', 
            userId: newUser.id 
        });

    } catch (error) {
        next(error); // Transmet l'erreur au gestionnaire centralisé
    }
});

// ====================================================================
// ROUTE : Connexion (POST /api/auth/login)
// ====================================================================
router.post('/login', authLimiter, async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis.' });
        }

        // 1. Recherche de l'utilisateur
        const user = await User.findOne({ where: { email } });
        
        // 2. Sécurité : Message générique en cas d'échec pour éviter l'énumération d'identifiants
        if (!user) {
            return res.status(401).json({ error: 'Identifiants incorrects.' });
        }

        // 3. Vérification du mot de passe haché
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Identifiants incorrects.' });
        }

        // 4. Génération du jeton de sécurité JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '2h' } // Le jeton expire après 2 heures
        );

        res.status(200).json({
            message: 'Connexion réussie.',
            token: token
        });

    } catch (error) {
        next(error);
    }
});

module.exports = router;