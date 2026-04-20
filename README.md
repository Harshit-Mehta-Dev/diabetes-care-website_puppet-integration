# Diabetes Care Companion 🩺
[![Build Status](https://img.shields.io/badge/Jenkins-Success-brightgreen)](http://localhost:8080)
[![Security](https://img.shields.io/badge/Security-Hardened-blue)](#security-hardening-)
[![Docker](https://img.shields.io/badge/Docker-Non--Root-orange)](./Dockerfile)

A state-of-the-art, secure, and automated web application designed to empower individuals with Type 1 and Type 2 diabetes. This platform integrates real-time AI assistance, health tracking, and automated CI/CD infrastructure to ensure clinical reliability and high availability.

---

## 📂 Project Architecture

```text
├── Server/
│   └── server1.js             # Express core: API routes, Middleware, & Socket connections
│       ├── GET /api/user      # Fetches user profile and health settings
│       ├── POST /api/glucose  # Saves new blood sugar readings to the database
│       └── POST /api/chat     # Proxy to AI API (OpenAI/Gemini) for chatbot logic
├── public/                    # Static assets served to the client browser
│   ├── css/
│   │   └── style.css          # Global variables, Flexbox/Grid layouts, & Dark mode themes
│   ├── js/
│   │   ├── chatbot.js         # Chat UI logic: Message streams, auto-scroll, & API fetching
│   │   ├── main.js            # App Orchestrator: Event listeners, SPA-style view switching
│   │   ├── profile.js         # User state: Handling personal targets (HbA1c, weight, etc.)
│   │   └── tracker.js         # Data Visualization: Input validation & Chart.js/D3 integration
│   └── assets/                # (Recommended) Icons, logos, and medical illustrations
├── index.html                 # Main entry point: Holds the SPA containers and JS bundles
├── .env                       # (Crucial) Stores sensitive API keys & DB strings (hidden)
├── .gitignore                 # Prevents node_modules and .env from being leaked to Git
├── node_modules/              # Installed dependencies (Express, Dotenv, Cors, etc.)
├── package-lock.json          # Deterministic dependency tree for consistent builds
├── package.json               # Scripts (start, dev) and project metadata
└── README.md                  # Project roadmap, setup instructions, and API documentation
```

---

## 🛠 CI/CD Pipelines & DevOps

The platform is backed by a professional automation suite to ensure every change is tested, secured, and deployed seamlessly.

### 1. Jenkins Automation (Continuous Integration)
- **Tooling**: Jenkins (Linux/Snap environment).
- **Stages**:
  - **Checkout**: Pulls code from GitHub using SSH.
  - **Dependencies**: Clean installation using `npm install`.
  - **Security Audit**: Automated `Jest` testing with `--detectOpenHandles`.
  - **Dockerization**: Builds the hardened production image.
  - **Deployment**: Automatic container rotation on port `1012`.

### 2. Docker Specification (Continuous Deployment)
- **Base Image**: `node:20-alpine` (Minimal footprint).
- **Security Hardening**:
  - **User**: Runs under a non-privileged `node` user (UID 1000).
  - **Workdir**: Isolated `/app` directory with strict ownership.
  - **Cleanup**: Multistage-like logic to keep production images under 150MB.

### 3. Kubernetes Orchestration (Scalability)
- **Architecture**: `Deployment` + `Service` (LoadBalancer).
- **Self-Healing**: Configured with `Liveness` and `Readiness` probes to automatically restart failing nodes.
- **Resources**: CPU limits (`500m`) and Memory limits (`512Mi`) to prevent resource exhaustion.
- **Secrets**: Integrated with K8s `Secrets` for safe handling of API keys.

---

## 🔐 Security Hardening 

We prioritize patient data security through multiple layers of defense:
- **Strict Content Security Policy (CSP)**: Curated whitelists for CDNs (Chart.js, Google Fonts) to block XSS and malicious scripts.
- **Secret Sanitization**: Automated Git history scrubbing to ensure no keys are ever stored in the repository record.
- **Input Validation**: Hardened server-side validation on `/api/chat` to prevent injection attacks and server crashes.

---

## 🌿 Modular Branching Strategy

The repository follows a partition-based structure to isolate concerns:
- **`main`**: The "Source of Truth" with the complete integrated system.
- **`system-infra`**: Infrastructure logic (Jenkinsfile, Dockerfile, K8s YAMLs).
- **`system-server`**: Backend Express logic and API integrations.
- **`system-ui`**: Front-end presentation (HTML & Images).
- **`system-logic`**: Front-end behavior (JavaScript).
- **`system-styles`**: Global visual design (CSS).
- **`system-docs`**: Project documentation and roadmaps.

---

## 🚀 Getting Started

1. **Clone the project**:
   ```bash
   git clone https://github.com/harshit-mehta-lab/diabetes-care-website.git
   ```
2. **Setup SSL/API Keys**:
   Add your `GEMINI_API_KEY` to a `.env` file in the `Server/` directory.
3. **Run with NPM**:
   ```bash
   npm install && npm start
   ```

---
*Developed by Harshit Mehta for the Advanced Diabetes Care Lab.*
