const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');

let token;
let otherToken;
let taskId;

beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Créer les deux utilisateurs et récupérer leurs tokens
    await request(app).post('/api/auth/register').send({ email: 'owner@test.com', password: 'motdepasse123' });
    await request(app).post('/api/auth/register').send({ email: 'other@test.com', password: 'motdepasse123' });

    const ownerLogin = await request(app).post('/api/auth/login').send({ email: 'owner@test.com', password: 'motdepasse123' });
    const otherLogin = await request(app).post('/api/auth/login').send({ email: 'other@test.com', password: 'motdepasse123' });

    token = ownerLogin.body.token;
    otherToken = otherLogin.body.token;
});

describe('GET /api/tasks — sans authentification', () => {
    test('401 — refuse l\'accès sans token', async () => {
        const res = await request(app).get('/api/tasks');
        expect(res.status).toBe(401);
    });
});

describe('POST /api/tasks — sans authentification', () => {
    test('401 — refuse la création sans token', async () => {
        const res = await request(app).post('/api/tasks').send({ title: 'Tâche test' });
        expect(res.status).toBe(401);
    });
});

describe('CRUD des tâches (utilisateur authentifié)', () => {
    test('200 — GET retourne une liste vide au départ', async () => {
        const res = await request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(0);
    });

    test('201 — POST crée une nouvelle tâche', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Ma première tâche', description: 'Description de test' });
        expect(res.status).toBe(201);
        expect(res.body.title).toBe('Ma première tâche');
        expect(res.body.description).toBe('Description de test');
        expect(res.body.status).toBe('A faire');
        taskId = res.body.id;
    });

    test('400 — POST rejette une tâche sans titre', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({ description: 'Sans titre' });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    test('200 — GET retourne la tâche créée', async () => {
        const res = await request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].title).toBe('Ma première tâche');
    });

    test('200 — PUT met à jour le statut de la tâche', async () => {
        const res = await request(app)
            .put(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Ma première tâche', status: 'En cours' });
        expect(res.status).toBe(200);
        expect(res.body.task.status).toBe('En cours');
    });

    test('200 — PUT met à jour le titre et la description', async () => {
        const res = await request(app)
            .put(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Titre modifié', description: 'Nouvelle description', status: 'En cours' });
        expect(res.status).toBe(200);
        expect(res.body.task.title).toBe('Titre modifié');
        expect(res.body.task.description).toBe('Nouvelle description');
    });

    test('200 — DELETE supprime la tâche', async () => {
        const res = await request(app)
            .delete(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Tâche supprimée.');
    });

    test('404 — DELETE retourne 404 pour une tâche inexistante', async () => {
        const res = await request(app)
            .delete(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(404);
    });
});

describe('Isolation entre utilisateurs', () => {
    let privateTaskId;

    beforeAll(async () => {
        const res = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Tâche privée' });
        privateTaskId = res.body.id;
    });

    test('200 — GET ne retourne pas les tâches des autres utilisateurs', async () => {
        const res = await request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${otherToken}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(0);
    });

    test('403 — PUT refuse la modification d\'une tâche appartenant à un autre utilisateur', async () => {
        const res = await request(app)
            .put(`/api/tasks/${privateTaskId}`)
            .set('Authorization', `Bearer ${otherToken}`)
            .send({ title: 'Tâche privée', status: 'Terminé' });
        expect(res.status).toBe(403);
    });

    test('403 — DELETE refuse la suppression d\'une tâche appartenant à un autre utilisateur', async () => {
        const res = await request(app)
            .delete(`/api/tasks/${privateTaskId}`)
            .set('Authorization', `Bearer ${otherToken}`);
        expect(res.status).toBe(403);
    });
});
