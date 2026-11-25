
const app = require('./app');
const { createEurekaClient } = require('./config/eureka');

// Port du microservice MEETING
const PORT = Number(process.env.PORT) || 8088;

// Configuration Eureka
const eurekaClient =
    process.env.EUREKA_ENABLED === 'false'
        ? null
        : createEurekaClient(PORT);

// Démarrage du serveur HTTP
const server = app.listen(PORT, () => {
  console.log(
      `Meeting service on http://localhost:${PORT} (Swagger: /swagger-ui)`
  );

  if (!eurekaClient) return;

  // Enregistrement dans Eureka
  eurekaClient.start((err) => {
    if (err) {
      console.error(
          'Eureka registration failed:',
          err.message || err
      );
    } else {
      console.log(
          `Registered in Eureka as MEETING (localhost:meeting:${PORT})`
      );
    }
  });
});

// Arrêt propre et désenregistrement Eureka
let stopping = false;

function shutdown(signal) {
  if (stopping) return;
  stopping = true;

  console.log(
      `${signal} received, deregistering from Eureka...`
  );

  const close = () =>
      server.close(() => process.exit(0));

  if (eurekaClient) {
    eurekaClient.stop(close);
  } else {
    close();
  }

  setTimeout(() => process.exit(0), 5000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
