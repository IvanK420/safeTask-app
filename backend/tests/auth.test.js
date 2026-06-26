const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

describe('POST /api/auth/register', () => {
    test('201 — inscrit un nouvel utilisateur', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: 'user@test.com', password: 'motdepasse123' });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('userId');
        expect(res.body.message).toBe('Utilisateur créé avec succès.');
    });

    test('400 — rejette si email manquant', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ password: 'motdepasse123' });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    test('400 — rejette si mot de passe manquant', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: 'user2@test.com' });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    test('409 — rejette un email déjà enregistré', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: 'user@test.com', password: 'autremotdepasse' });
        expect(res.status).toBe(409);
        expect(res.body).toHaveProperty('error');
    });
});

describe('POST /api/auth/login', () => {
    test('200 — retourne un token JWT pour des identifiants valides', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'user@test.com', password: 'motdepasse123' });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(typeof res.body.token).toBe('string');
    });

    test('401 — rejette un mot de passe incorrect', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'user@test.com', password: 'mauvais' });
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error');
    });

    test('401 — rejette un email inexistant', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'inconnu@test.com', password: 'motdepasse123' });
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error');
    });

    test('400 — rejette une requête sans champs', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({});
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });
});
