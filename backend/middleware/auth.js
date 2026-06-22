const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // 1. Récupération du header Authorization (Format attendu : "Bearer <TOKEN>")
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Accès refusé. Jeton d\'authentification manquant.' });
        }

        // 2. Vérification et décodage du jeton
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
            if (err) {
                return res.status(403).json({ error: 'Jeton invalide ou expiré.' });
            }

            // 3. Stockage des infos de l'utilisateur dans l'objet req pour les routes suivantes
            req.user = decodedUser;
            next(); // On passe à la fonction suivante (la route métier)
        });

    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la vérification de la sécurité.' });
    }
};