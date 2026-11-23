const app = require('./app');
const { Eureka } = require('eureka-js-client');

const PORT = Number(process.env.PORT || 8083);

const eureka = new Eureka({
    instance: {
        app: 'MEETING',
        instanceId: `MEETING:localhost:${PORT}`,
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        statusPageUrl: `http://localhost:${PORT}/info`,
        healthCheckUrl: `http://localhost:${PORT}/health`,
        port: { '$': PORT, '@enabled': 'true' },
        vipAddress: 'MEETING',
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
    },
    eureka: {
        host: 'localhost',
        port: 8761,
        servicePath: '/eureka/apps/',
    },
});

eureka.on('registered', () => {
    console.log('MEETING enregistré dans Eureka');
});

app.listen(PORT, () => {
    console.log(`Meeting running on http://localhost:${PORT}`);
    console.log(`Swagger UI: http://localhost:${PORT}/swagger-ui`);
    eureka.start();
});
