
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const openapiSpec = require('./config/swagger');
const meetingRoutes = require('./routes/meeting.routes');

const app = express();

// ==========================================
// 1. CONFIGURATION EXPRESS
// ==========================================

app.use(express.json());

// ==========================================
// 2. SWAGGER / OPENAPI
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
// 3. ENDPOINT HEALTH
// ==========================================

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP'
  });
});

// ==========================================
// 4. ENDPOINT INFO
// ==========================================

app.get('/info', (req, res) => {
  res.status(200).json({
    app: {
      name: 'MEETING',
      version: '1.0.0',
      description: 'Microservice de gestion des meetings',
      port: Number(process.env.PORT) || 8088
    }
  });
});

// ==========================================
// 5. ROUTES CRUD MEETING
// ==========================================

app.use('/api/meetings', meetingRoutes);

// ==========================================
// 6. GESTION DES ROUTES INCONNUES
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    status: 404,
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// ==========================================
// 7. GESTION DES ERREURS
// ==========================================

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
