# Project Documentation: End-to-End DevOps CI/CD & Automated Infrastructure Management

**Project Title:** End-to-End DevOps CI/CD Pipeline & Automated Infrastructure Management using Docker, Jenkins, Maven, Puppet, and Nagios  
**Target Repository:** `diabetes-care-website_puppet-integration`  
**Course Code:** INT333  

---

## 1. Introduction
In modern software engineering, ensuring reliable delivery, consistent infrastructure states, and high system availability requires an integrated DevOps lifecycle. Traditional deployments suffer from manual configuration errors, environmental discrepancies, and reactive monitoring.

This project implements a complete, automated Continuous Integration and Continuous Deployment (CI/CD) pipeline coupled with configuration management and continuous monitoring. By leveraging **Jenkins**, **Maven**, and **Docker** for build and containerized deployment, **Puppet** for automated infrastructure provisioning, and **Nagios** for real-time health monitoring, this platform establishes an enterprise-ready, resilient software delivery framework.

---

## 2. Tools, Technologies & Methodology

### Technologies Used
- **Version Control:** Git & GitHub (Source code management and branching workflows).
- **Build Tool:** Apache Maven (`pom.xml`) / NPM (Dependency management, build automation, test suites).
- **CI/CD Automation:** Jenkins (`Jenkinsfile`) & GitHub Actions (`.github/workflows/ci.yml`).
- **Containerization:** Docker (`Dockerfile`, `docker-compose.yml`) for microservice isolation.
- **Configuration Management:** Puppet Master & Agent (`puppet/manifests/site.pp`, `puppet/modules/`, `puppet.conf`) for declarative state management.
- **Monitoring & Alerting:** Nagios Core (`nagios/etc/`, `nagios/plugins/check_docker.sh`) for host, HTTP endpoints, and container metrics.

### Methodology & Pipeline Architecture Flowchart

```
+-------------------------------------------------------+
|                 Developer Code Push                   |
|                      (GitHub)                         |
+---------------------------+---------------------------+
                            |
                            v
+-------------------------------------------------------+
|                Trigger CI/CD Pipeline                 |
|             (Jenkins / GitHub Actions)                |
+---------------------------+---------------------------+
                            |
                            v
+-------------------------------------------------------+
|                 Build & Test (Maven)                  |
|                 mvn clean test package                |
+---------------------------+---------------------------+
                            |
                            v
+-------------------------------------------------------+
|                 Containerize (Docker)                 |
|            docker build -t diabetes-care              |
+---------------------------+---------------------------+
                            |
                            v
+-------------------------------------------------------+
|                 Provisioning (Puppet)                 |
|           puppet apply / puppet agent sync            |
+---------------------------+---------------------------+
                            |
                            v
+-------------------------------------------------------+
|                  Monitoring (Nagios)                  |
|           check_http, check_docker, alerts            |
+-------------------------------------------------------+
```

### Step-by-Step Execution Lifecycle
1. **Code Integration:** Source code is committed and pushed to GitHub branches. Automated webhooks trigger Jenkins / GitHub Actions pipelines.
2. **Automated Build & Test:** Maven and test harnesses execute tests to validate data structures, triage calculations, and API contracts.
3. **Container Creation:** Docker packages the Node/Express backend and clinical frontend into a lightweight Alpine-based container.
4. **Configuration & Deployment:** Puppet Agent synchronizes with Puppet Master to enforce required system packages, configuration files (`.env`), and start Docker containers declaratively.
5. **Continuous Monitoring:** Nagios daemon checks HTTP port 1012, Docker container runtime status via custom plugins, disk consumption, and CPU load.

---

## 3. Objectives
- **Automate Code Compilation & Testing:** Eliminate manual compilation and unit test execution using Apache Maven and Jenkins pipelines.
- **Standardize Deployment Environments:** Containerize applications using Docker to resolve "it works on my machine" issues across staging and production.
- **Automate Infrastructure Provisioning:** Use Puppet manifests to automatically enforce declarative configurations on remote deployment servers.
- **Implement Proactive System Monitoring:** Configure Nagios services to continuously track node metrics, system services, and container uptime.
- **Establish Rapid Recovery & High Uptime:** Enable automated failure detection via Nagios and quick rollbacks/re-provisioning via Jenkins and Puppet.

---

## 4. Outcomes (Expected Results)
- **Zero-Downtime Delivery:** Fully functional automated pipeline triggering on git pushes, reducing deployment overhead by automating testing and container creation.
- **Consistent Server State:** Automated configuration of deployment environments via Puppet, ensuring zero drift between configuration files and active host settings.
- **Containerized Workloads:** Production-ready Docker images running isolated services, minimizing resource consumption and startup latency.
- **Real-time Health Visibility:** Centralized Nagios monitoring dashboard displaying host load, memory usage, network health, and active container statuses with immediate alert triggers.

---

## 5. Security & Vulnerability Analysis
- **Zero Plaintext Secrets:** No real API keys, SSH keys, or passwords committed to Git. Environment variables are injected dynamically via CI/CD secrets.
- **Principle of Least Privilege:** Docker runs unprivileged workloads; Nagios and Puppet manage permissions explicitly with 0755 and 0600 file modes.
- **Branch Protection Ready:** Modular branches allow code review and automated CI validation prior to production merges.

---

## 6. Conclusion
This project demonstrates the effective integration of build automation, container management, automated provisioning, and continuous monitoring into a cohesive DevOps workflow. Combining Docker, Jenkins, Maven, Puppet, and Nagios bridges the gap between software development and IT operations. The resulting pipeline guarantees rapid release cycles, predictable deployment environments, proactive issue detection, and high application availability.
