
const { Eureka } = require('eureka-js-client');

function createEurekaClient(port) {

    // Configuration de l'instance MEETING
    const host = process.env.EUREKA_INSTANCE_HOST || 'localhost';
    const ip = process.env.EUREKA_INSTANCE_IP || '127.0.0.1';
    const baseUrl = `http://${host}:${port}`;

    return new Eureka({
        instance: {
            app: 'MEETING',

            instanceId: `${host}:meeting:${port}`,

            hostName: host,
            ipAddr: ip,

            port: {
                $: port,
                '@enabled': 'true'
            },

            vipAddress: 'meeting',

            // Documentation Swagger
            homePageUrl: `${baseUrl}/swagger-ui`,

            // Informations du microservice
            statusPageUrl: `${baseUrl}/info`,

            // Verification de la sante
            healthCheckUrl: `${baseUrl}/health`,

            dataCenterInfo: {
                '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
                name: 'MyOwn'
            }
        },

        eureka: {
            host: process.env.EUREKA_HOST || 'localhost',
            port: Number(process.env.EUREKA_PORT) || 8761,

            servicePath: '/eureka/apps/',

            maxRetries: 10,
            requestRetryDelay: 2000
        }
    });
}

module.exports = { createEurekaClient };
