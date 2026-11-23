const { Eureka } = require('eureka-js-client');
const app = require('./app');

const PORT = Number(process.env.PORT) || 8083;
const HOST = 'localhost';

const client = new Eureka({
  instance: {
    app: 'MEETING',
    instanceId: `meeting:${PORT}`,
    hostName: HOST,
    ipAddr: '127.0.0.1',
    port: { '$': PORT, '@enabled': true },
    vipAddress: 'meeting',
    healthCheckUrl: `http://${HOST}:${PORT}/health`,
    statusPageUrl: `http://${HOST}:${PORT}/info`,
    homePageUrl: `http://${HOST}:${PORT}/api/meetings/hello`,
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

const server = app.listen(PORT, () => {
  console.log(`meeting microservice running on http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/swagger-ui`);
  client.start((error) => {
    console.log(error ? `Eureka registration failed: ${error}` : 'Registered in Eureka as MEETING');
  });
});

function shutdown() {
  client.stop(() => server.close(() => process.exit(0)));
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);