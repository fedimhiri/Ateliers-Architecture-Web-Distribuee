
const app = require('./app');
const Eureka = require('eureka-js-client').Eureka;

const PORT = parseInt(process.env.PORT || '8083', 10);

// Configuration du client Eureka
const client = new Eureka({
    instance: {
        app: 'MEETING',
        hostName: 'localhost',
        ipAddr: '127.0.0.1',

        port: {
            '$': PORT,
            '@enabled': 'true'
        },

        statusPageUrl: `http://localhost:${PORT}/info`,
        healthCheckUrl: `http://localhost:${PORT}/health`,
        homePageUrl: `http://localhost:${PORT}/`,

        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn'
        },
        vipAddress: 'MEETING',
        instanceId: `localhost:MEETING:${PORT}`,

    },

    eureka: {
        host: 'localhost',
        port: 8761,
        servicePath: '/eureka/apps/'
    }
});

// Démarrage du serveur Meeting
const server = app.listen(PORT, () => {
    console.log(`Meeting microservice running on http://localhost:${PORT}`);
    console.log(`Swagger UI: http://localhost:${PORT}/swagger-ui`);

    // Enregistrement du service dans Eureka
    client.start();
});

// Arrêt propre du microservice
process.on('SIGINT', () => {
    console.log('Stopping Meeting service...');

    client.stop();
    server.close(() => process.exit(0));
});
