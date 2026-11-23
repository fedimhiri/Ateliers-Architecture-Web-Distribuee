
const app = require('./app');
const { Eureka } = require('eureka-js-client');
const pkg = require('../package.json');

// Port du microservice Meeting
const PORT = Number(process.env.PORT) || 8088;

// ==========================================
// ENDPOINTS HEALTH ET INFO
// ==========================================

// Vérifier l'état de santé du microservice
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
// CONFIGURATION EUREKA CLIENT
// ==========================================

const client = new Eureka({
  instance: {
    app: 'MEETING',
    instanceId: `localhost:meeting:${PORT}`,
    hostName: 'localhost',
    ipAddr: '127.0.0.1',

    port: {
      '$': PORT,
      '@enabled': 'true'
    },

    vipAddress: 'meeting',

    // Endpoints de santé et d'information
    healthCheckUrl: `http://localhost:${PORT}/health`,
    statusPageUrl: `http://localhost:${PORT}/info`,
    homePageUrl: `http://localhost:${PORT}/`,

    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn'
    }
  },

  eureka: {
    host: 'localhost',
    port: 8761,
    servicePath: '/eureka/apps/',
    registerWithEureka: true,
    fetchRegistry: true
  }
});

// ==========================================
// DEMARRAGE DU SERVEUR EXPRESS
// ==========================================

const server = app.listen(PORT, () => {
  console.log(`Meeting running on http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/swagger-ui`);
  console.log(`Health: http://localhost:${PORT}/health`);
  console.log(`Info: http://localhost:${PORT}/info`);

  // Enregistrer Meeting dans Eureka
  client.start((error) => {
    if (error) {
      console.error('Erreur Eureka :', error);
    } else {
      console.log('MEETING enregistre dans Eureka !');
    }
  });
});

// ==========================================
// ARRET PROPRE DU MICROSERVICE
// ==========================================

function shutdown() {
  console.log('Arret de Meeting...');

  client.stop(() => {
    server.close(() => {
      process.exit(0);
    });
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
