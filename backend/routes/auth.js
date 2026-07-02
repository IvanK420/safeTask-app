const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { User } = require('../models');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Inscription et connexion
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Créer un compte utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: monMotDePasse
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Utilisateur créé avec succès. }
 *                 userId:  { type: integer, example: 1 }
 *       400:
 *         description: Champ manquant
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       409:
 *         description: Email déjà utilisé
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       429:
 *         description: Trop de tentatives — réessayer dans 15 minutes
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Se connecter et obtenir un JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: monMotDePasse
 *     responses:
 *       200:
 *         description: Connexion réussie — retourne un JWT valable 2h
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Connexion réussie. }
 *                 token:   { type: string, example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... }
 *       400:
 *         description: Champ manquant
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         description: Identifiants incorrects
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       429:
 *         description: Trop de tentatives — réessayer dans 15 minutes
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */

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