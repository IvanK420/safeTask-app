const express = require('express');
const router = express.Router();
const { Task } = require('../models');
const authMiddleware = require('../middleware/auth');

// Toutes les routes de ce fichier utilisent le middleware de sécurité
router.use(authMiddleware);

// 1. LIRE les tâches de l'utilisateur connecté (GET /api/tasks)
router.get('/', async (req, res, next) => {
    try {
        // Isolation stricte : on ne récupère QUE les tâches de l'utilisateur connecté
        const tasks = await Task.findAll({ where: { UserId: req.user.id } });
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
});

// 2. CRÉER une tâche (POST /api/tasks)
router.post('/', async (req, res, next) => {
    try {
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Le titre de la tâche est obligatoire.' });
        }

        const newTask = await Task.create({
            title,
            description,
            UserId: req.user.id // Liaison automatique avec l'utilisateur connecté
        });

        res.status(201).json(newTask);
    } catch (error) {
        next(error);
    }
});

// 3. MODIFIER le statut d'une tâche (PUT /api/tasks/:id)
router.put('/:id', async (req, res, next) => {
    try {
        const { title, description, status } = req.body;
        const task = await Task.findByPk(req.params.id);

        if (!task) {
            return res.status(404).json({ error: 'Tâche non trouvée.' });
        }

        // SÉCURITÉ CRUCIALE : Vérification de la propriété de la ressource
        if (task.UserId !== req.user.id) {
            return res.status(403).json({ error: 'Action non autorisée. Cette tâche ne vous appartient pas.' });
        }

        // Mise à jour défensive via l'ORM
        await task.update({ title, description, status });
        res.status(200).json({ message: 'Tâche mise à jour avec succès.', task });
    } catch (error) {
        next(error);
    }
});

// 4. SUPPRIMER une tâche (DELETE /api/tasks/:id)
router.delete('/:id', async (req, res, next) => {
    try {
        const task = await Task.findByPk(req.params.id);

        if (!task) {
            return res.status(404).json({ error: 'Tâche non trouvée.' });
        }

        // SÉCURITÉ CRUCIALE : Vérification de la propriété
        if (task.UserId !== req.user.id) {
            return res.status(403).json({ error: 'Action non autorisée.' });
        }

        await task.destroy();
        res.status(200).json({ message: 'Tâche supprimée.' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;