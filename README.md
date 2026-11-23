# Atelier Architecture Web Distribuée - Eureka

## Équipe
- Yosr Kobbi
- Mohamed Fedi Mhiri
- Mohamed Aziz Bougacha
- Yassmine Rahmouni

## Architecture

| Microservice | Techno | Port | Nom Eureka |
|---|---|---|---|
| Discovery | Spring Boot | 8761 | - |
| Candidat | Spring Boot + H2 | 8081 (+8091) | CANDIDAT |
| Job | Spring Boot + MySQL | 8082 | JOB |
| Candidature | Spring Boot | 8085 | CANDIDATURE |
| Meeting | Node.js / Express | 8083 (+8093) | MEETING |
| Notification | Python / FastAPI | 8084 (+8094) | NOTIFICATION |

## Lancement

1. Démarrer Eureka (`discovery`).
2. Démarrer Candidat, Job et Candidature.
3. Meeting : `$env:PORT=8083; npm start`
4. Notification : `$env:PORT=8084; python main.py`

## Dashboard Eureka
![Dashboard Eureka](docs/eureka-dashboard.png)



# Atelier 2 — Observabilité avec Spring Boot Actuator

## Objectif

L'objectif de ce deuxième atelier est de surveiller l'état de santé des microservices, de consulter leurs métriques et de détecter les pannes.

Pour cela, nous avons utilisé Spring Boot Actuator pour les services Java et ajouté des endpoints de santé aux services Node.js et Python.

## Partie 1 — Mise en place de Spring Boot Actuator

Nous avons ajouté la dépendance `spring-boot-starter-actuator` aux microservices Candidat et Job.

Nous avons ensuite configuré les endpoints suivants :

| **Endpoint** | **Fonction** |
|---|---|
| `/actuator/health` | Vérifier l'état de santé du microservice |
| `/actuator/info` | Afficher les informations de l'application |
| `/actuator/metrics` | Consulter les métriques disponibles |

Nous avons également activé la transmission de l'état de santé vers Eureka avec la propriété :

```properties
eureka.client.healthcheck.enabled=true
```

## Partie 2 — Vérification de l'état de santé

Nous avons testé l'endpoint `/actuator/health` des microservices Candidat et Job.

Les résultats ont confirmé que :

- Le microservice Candidat fonctionne avec sa base H2.
- Le microservice Job fonctionne avec sa base MySQL.
- Actuator permet d'afficher l'état des différents composants.

## Partie 3 — Simulation d'une panne MySQL

Nous avons simulé une panne en arrêtant le service MySQL depuis WAMP, tout en laissant le microservice Job en cours d'exécution.

**Résultats observés :**

1. Avant la panne, le microservice Job avait le statut `UP`.
2. Après l'arrêt de MySQL, Actuator a détecté la perte de connexion et affiché `DOWN`.
3. Le statut `DOWN` a également été transmis au dashboard Eureka.
4. Après le redémarrage de MySQL, le microservice Job a retrouvé le statut `UP`.

Cette expérience montre l'intérêt de relier Spring Boot Actuator à Eureka afin de surveiller la santé réelle des microservices.

## Partie 4 — Consultation des informations et métriques

Nous avons utilisé les endpoints `/actuator/info` et `/actuator/metrics` du microservice Candidat.

Les métriques consultées comprennent notamment :

- `jvm.memory.used` : mémoire utilisée par la JVM.
- `http.server.requests` : statistiques des requêtes HTTP.
- `COUNT` : nombre de requêtes.
- `TOTAL_TIME` : durée cumulée des requêtes.
- `MAX` : durée maximale mesurée.

Ces informations permettent de mieux comprendre le fonctionnement et les performances du microservice.

## Partie 5 — Santé des services Node.js et Python

### Microservice Meeting — Node.js / Express

Nous avons ajouté deux endpoints :

- `GET /health` : retourne `{"status":"UP"}`.
- `GET /info` : retourne le nom et la version du service, lus depuis `package.json`.

Nous avons également configuré `healthCheckUrl` et `statusPageUrl` dans le client Eureka.

**Endpoints :**

- http://localhost:8083/health
- http://localhost:8083/info

### Microservice Notification — Python / FastAPI

Nous avons ajouté les endpoints :

- `GET /health` : vérifie la disponibilité du microservice.
- `GET /info` : affiche le nom et la version du service.

Nous avons configuré les paramètres `health_check_url` et `status_page_url` lors de l'enregistrement du microservice dans Eureka.

**Endpoints :**

- http://localhost:8084/health
- http://localhost:8084/info

Nous avons ensuite vérifié les URL enregistrées dans Eureka à l'adresse :

http://localhost:8761/eureka/apps/NOTIFICATION

Le registre Eureka confirme que le microservice Notification est enregistré avec le statut `UP` et les bonnes URL de santé et d'information.

---

## Rapport et captures de l'atelier 2

Le compte rendu détaillé contient les captures des tests, les résultats obtenus et les explications des différentes étapes.

[**Consulter le rapport complet de l'atelier 2 (PDF)**](https://github.com/fedimhiri/Ateliers-Architecture-Web-Distribuee/blob/bouga/documentation/atelier2_actuator.pdf)

## Technologies utilisées

- Java
- Spring Boot
- Spring Cloud Netflix Eureka
- Spring Boot Actuator
- Node.js et Express
- Python et FastAPI
- MySQL et H2
- Maven
- IntelliJ IDEA
- Git et GitHub

## Conclusion générale

Ces deux ateliers nous ont permis de mettre en place et de superviser une architecture microservices.

Le premier atelier nous a permis de comprendre le fonctionnement d'Eureka et de la découverte des services.

Le deuxième atelier nous a montré comment surveiller l'état de santé des microservices, consulter leurs métriques et détecter les pannes grâce à Spring Boot Actuator et aux endpoints de santé personnalisés.

Nous avons ainsi pu observer le fonctionnement d'une architecture distribuée et comprendre l'importance de la supervision des services.
