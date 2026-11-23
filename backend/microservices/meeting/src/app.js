
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const openapiSpec = require('./config/swagger');
const meetingRoutes = require('./routes/meeting.routes');
const pkg = require('../package.json');

const app = express();

app.use(express.json());

// ==========================================
// HEALTH ET INFO - OBSERVABILITE
// ==========================================

// Verifier que le microservice fonctionne
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP'
  });
});

// Afficher les informations du microservice
app.get('/info', (req, res) => {
  res.status(200).json({
    name: pkg.name,
    version: pkg.version
  });
});

// ==========================================
// SWAGGER DOCUMENTATION
// ==========================================

app.get('/v3/api-docs', (req, res) => {
  res.json(openapiSpec);
});

app.use(
    '/swagger-ui',
    swaggerUi.serve,
    swaggerUi.setup(openapiSpec)
);

// ==========================================
// API ROUTES
// ==========================================

app.use('/api/meetings', meetingRoutes);

// ==========================================
// 404 - ROUTES INCONNUES
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    status: 404,
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// ==========================================
// GESTION DES ERREURS
// ==========================================

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;

  res.status(status).json({
    status,
    error: status === 500
        ? 'Internal Server Error'
        : 'Error',
    message: err.message
  });
});

module.exports = app;
