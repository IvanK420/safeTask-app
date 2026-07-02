const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

app.set('trust proxy', 1);
app.use(helmet({
    contentSecurityPolicy: false // nécessaire pour que Swagger UI charge ses assets
}));
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5000'], credentials: true }));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'SafeTask API Docs'
}));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'API opérationnelle.' });
});

app.use((err, req, res, next) => {
    console.error('[ERROR LOG] :', err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Une erreur interne est survenue sur le serveur.'
    });
});

module.exports = app;
