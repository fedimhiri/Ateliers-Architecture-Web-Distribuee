package tn.esprit.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.loadbalancer.annotation.LoadBalancerClient;

import tn.esprit.gateway.loadbalancer.RandomLoadBalancerConfiguration;

@SpringBootApplication
@EnableDiscoveryClient
@LoadBalancerClient(
        name = "candidat",
        configuration = RandomLoadBalancerConfiguration.class
)
public class GatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}
