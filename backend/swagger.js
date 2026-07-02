const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SafeTask API',
            version: '1.0.0',
            description: 'API REST de gestion de tâches sécurisée — authentification JWT, isolation des données par utilisateur.',
        },
        servers: [
            { url: 'http://localhost:5000', description: 'Serveur de développement' }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Token JWT obtenu via POST /api/auth/login'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id:        { type: 'integer', example: 1 },
                        email:     { type: 'string', format: 'email', example: 'user@example.com' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                Task: {
                    type: 'object',
                    properties: {
                        id:          { type: 'integer', example: 1 },
                        title:       { type: 'string', example: 'Rédiger le rapport' },
                        description: { type: 'string', example: 'Rapport trimestriel Q2', nullable: true },
                        status: {
                            type: 'string',
                            enum: ['A faire', 'En cours', 'Terminé'],
                            example: 'A faire'
                        },
                        UserId:    { type: 'integer', example: 1 },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: { type: 'string', example: 'Message d\'erreur.' }
                    }
                }
            }
        }
    },
    apis: ['./routes/*.js']
};

module.exports = swaggerJsdoc(options);
