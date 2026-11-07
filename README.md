# End-to-End DevOps CI/CD Pipeline & Automated Infrastructure Management

[![CI/CD Pipeline](https://github.com/Harshit-Mehta-Dev/diabetes-care-website_puppet-integration/actions/workflows/ci.yml/badge.svg)](https://github.com/Harshit-Mehta-Dev/diabetes-care-website_puppet-integration/actions/workflows/ci.yml)
[![Node Version](https://img.shields.io/badge/Node.js-v20-brightgreen.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![Puppet](https://img.shields.io/badge/Puppet-Agent%20%26%20Master-orange.svg)](https://puppet.com/)
[![Nagios](https://img.shields.io/badge/Nagios-Core%20Monitoring-darkred.svg)](https://www.nagios.org/)

An enterprise-ready, fully automated DevOps platform integrating Continuous Integration and Continuous Deployment (CI/CD), declarative Infrastructure-as-Code (IaC), and real-time monitoring.

---

## 🏗️ Architecture & Pipeline Flow

```
+-------------------------------------------------------------+
|                     Developer Code Push                     |
|                   (GitHub Branch / Webhook)                 |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                   Trigger CI/CD Pipeline                    |
|                 (Jenkins / GitHub Actions)                  |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                    Build & Test (Maven)                     |
|                    mvn clean test package                   |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                    Containerize (Docker)                    |
|                docker build -t diabetes-care                |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                 Infrastructure Provisioning                 |
|             (Puppet Master & Agent Enforcement)             |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                    Continuous Monitoring                    |
|               (Nagios Host & Container Checks)              |
+-------------------------------------------------------------+
```

---

## 🛠️ Technology Stack

| Category | Tool | Description |
|---|---|---|
| **Version Control** | Git & GitHub | Source code control with dedicated multi-branch structure. |
| **Build & Test** | Apache Maven / NPM | Automated dependency management, compilation, and testing. |
| **CI/CD Orchestration** | Jenkins / GitHub Actions | Pipeline automation, triggers, Docker builds, and deployment verification. |
| **Containerization** | Docker | Microservice isolation and production-ready images. |
| **Configuration Mgmt** | Puppet (Master & Agent) | Declarative state management, host provisioning, and container enforcement. |
| **Health & Monitoring**| Nagios Core | Real-time monitoring of host metrics, HTTP endpoints, and container uptime. |

---

## 📂 Repository Structure

```
├── .github/workflows/ci.yml    # GitHub Actions enterprise workflow
├── Jenkinsfile                  # Jenkins pipeline with Maven, Docker, Puppet & Nagios stages
├── pom.xml                      # Apache Maven configuration & build wrapper
├── Dockerfile                   # Docker container specification
├── docker-compose.yml           # Multi-container orchestration
├── Server/                      # Node.js / Express clinical backend & triage engine
│   ├── server1.js
│   └── server1.test.js
├── public/                      # Responsive frontend web application
├── puppet/                      # Puppet Master & Agent configuration
│   ├── puppet.conf              # Agent configuration
│   ├── manifests/site.pp        # Main manifest declaring node classes
│   └── modules/
│       ├── docker/              # Docker daemon & dependency management
│       └── diabetes_app/        # Declarative container lifecycle & .env provisioning
├── nagios/                      # Nagios Core monitoring configuration
│   ├── etc/
│   │   ├── nagios.cfg           # Core configuration
│   │   └── objects/
│   │       ├── hosts.cfg        # Target node definitions
│   │       ├── services.cfg     # HTTP, Docker container, CPU & disk check services
│   │       └── commands.cfg     # Nagios command definitions
│   └── plugins/
│       └── check_docker.sh      # Custom Bash plugin for container health monitoring
└── docs/                        # Complete DevOps integration and handwritten synopsis guides
    ├── DEVOPS_INTEGRATION.md
    └── SYNOPSIS_HANDWRITTEN_GUIDE.md
```

---

## 🚀 Quickstart & Local Execution

### 1. Run with Docker
```bash
docker build -t diabetes-care-platform:latest .
docker run -d -p 1012:1012 --name diabetes-care-app diabetes-care-platform:latest
```

### 2. Apply Puppet Manifests
```bash
puppet apply --modulepath=puppet/modules puppet/manifests/site.pp
```

### 3. Verify Health with Nagios Custom Plugin
```bash
bash nagios/plugins/check_docker.sh diabetes-care-app
# Output: OK - Container 'diabetes-care-app' is running.
```

---

## 🔒 Security & Quality Assurance
- **Zero Committed Secrets:** All sensitive credentials are provided dynamically through environment variables and CI/CD secret vaults.
- **Vulnerability-Free Pipeline:** Strict dependency integrity validation and isolated container execution.
- **Clean Git History:** Sanitized repository structure free of hardcoded tokens or credentials.

---

## 📖 Synopsis Documentation
- For project presentation and handwritten submission instructions, view:
  - [`docs/SYNOPSIS_HANDWRITTEN_GUIDE.md`](file:///c:/Users/hp/Documents/diabetes-care-website/diabetes-care-website/docs/SYNOPSIS_HANDWRITTEN_GUIDE.md)
  - [`docs/DEVOPS_INTEGRATION.md`](file:///c:/Users/hp/Documents/diabetes-care-website/diabetes-care-website/docs/DEVOPS_INTEGRATION.md)
