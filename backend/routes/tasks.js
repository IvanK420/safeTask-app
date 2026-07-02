const express = require('express');
const router = express.Router();
const { Task } = require('../models');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Gestion des tâches (routes protégées par JWT)
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Récupérer toutes les tâches de l'utilisateur connecté
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des tâches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       401:
 *         description: Token manquant
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       403:
 *         description: Token invalide ou expiré
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *
 *   post:
 *     summary: Créer une nouvelle tâche
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Préparer la réunion
 *               description:
 *                 type: string
 *                 example: Rassembler les slides et les chiffres Q2
 *     responses:
 *       201:
 *         description: Tâche créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Titre manquant
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         description: Token manquant
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       403:
 *         description: Token invalide ou expiré
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Modifier une tâche
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Identifiant de la tâche
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Nouveau titre
 *               description:
 *                 type: string
 *                 example: Description mise à jour
 *               status:
 *                 type: string
 *                 enum: [A faire, En cours, Terminé]
 *                 example: En cours
 *     responses:
 *       200:
 *         description: Tâche mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Tâche mise à jour avec succès. }
 *                 task:    { $ref: '#/components/schemas/Task' }
 *       401:
 *         description: Token manquant
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       403:
 *         description: Token invalide, expiré ou tâche appartenant à un autre utilisateur
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       404:
 *         description: Tâche non trouvée
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *
 *   delete:
 *     summary: Supprimer une tâche
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Identifiant de la tâche
 *     responses:
 *       200:
 *         description: Tâche supprimée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Tâche supprimée. }
 *       401:
 *         description: Token manquant
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       403:
 *         description: Token invalide, expiré ou tâche appartenant à un autre utilisateur
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       404:
 *         description: Tâche non trouvée
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */

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