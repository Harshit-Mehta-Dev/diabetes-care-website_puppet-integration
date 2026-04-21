# Diabetes Care Companion 🩺
[![Build Status](https://img.shields.io/badge/Jenkins-Success-brightgreen)](http://localhost:8080)
[![Security](https://img.shields.io/badge/Security-Hardened-blue)](#security-hardening-)
[![Docker](https://img.shields.io/badge/Docker-Non--Root-orange)](./Dockerfile)

The Diabetes Care Companion is a modern, responsive Single Page Application (SPA) designed to facilitate effective chronic disease management. By integrating a React.js frontend with a Node.js backend, the platform provides users with essential tools such as an AI-powered chatbot, blood glucose tracking, and direct communication with healthcare professionals.
To address the common healthcare industry challenges of application downtime and inconsistent deployment environments, the project implements a robust DevOps framework. Utilizing Docker for containerization and Jenkins and GitHub Actions for Continuous Integration and Continuous Deployment (CI/CD), the project automates the software delivery lifecycle. This ensures that the application remains functional, consistent, and highly available across all stages of development and production.

---
## Functional Overview: Diabetes Management Tools

The platform focuses on simplicity and accessibility to support healthier lifestyles through meaningful health insights.
---

### 🩸 Blood Glucose Tracking and Interpretation
The **Blood Sugar Tracker** is a central feature that allows users to monitor their glucose levels throughout the day.

* **Logging Readings:** Users can log readings for three specific contexts: **Morning, Afternoon, and Night**.
* **Visual Status Indicators:** The application generates interactive charts and visual trends to help users interpret their data.
* **Range Interpretation:**
    * **Low:** Readings below **70 mg/dL**.
    * **Normal:** Readings within the target healthy range.
    * **High:** Readings above **180 mg/dL**.
* **A1C Estimation:** The tracker uses logged data to generate a 7-day average and an estimated A1C percentage.
---
### ✨ Additional Features

* **AI Chatbot:** Powered by **OpenAI’s GPT-3.5-turbo**, this assistant provides instant information regarding medications, diet, exercise, and management strategies for both Type 1 and Type 2 diabetes.
* **User Profile Management:** Users store personal health data—including age, gender, diabetes type, and current medications—to personalize their care.
* **Ask a Doctor:** A dedicated portal for submitting specific medical questions to professionals and tracking the status of previous inquiries.

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
```
├── Server
│   └── server1.js        # Express server setup and API endpoints
├── public
│   ├── css
│   │   └── style.css     # Main stylesheet
│   └── js
│       ├── chatbot.js    # Logic for the AI chatbot
│       ├── main.js       # Main javascript for DOM manipulation and navigation
│       ├── profile.js    # Logic for user profile management
│       └── tracker.js    # Logic for the blood sugar tracker
├── index.html            # Main HTML file
├── node_modules
├── package-lock.json
├── package.json
└── README.md
---
```

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
## 🌟 Key Features

- `AI Medical Chatbot`🤖: Powered by the Gemini API / GPT-3.5, offering 24/7 answers to queries about diet, insulin management, and lifestyle adjustments.
- `Intelligent Glucose Tracker`📈: Track morning, afternoon, and night readings with visual indicators (Low, Normal, High).
- `Patient Profile Management`👤: Store and update critical data including medication lists, diabetes type, and age.
- `Professional Q&A Interface`👨‍⚕️: Dedicated module for submitting specific medical questions to healthcare providers.
- `Responsive Dashboard`: A clean, modern UI designed for both mobile and desktop accessibility.

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
3. **Run with NPM**:
   ```bash
   npm install && npm start
4. **Setup Environment:
- Create a `.env file` in the Server/ directory and add your `API` key:
   ```bash
   GEMINI_API_KEY=your_key_here
   PORT=1012
   ```

---
## 📸 Explore the Application
This interactive project showcase provides a look into the visual environment of the application and its architectural framework. Click the image below to visit the main repository!

<img width="2752" height="1497" alt="unnamed (2)" src="https://github.com/user-attachments/assets/8c597c1c-5548-4d43-87a4-b95cba40420a" />

*Developed by Harshit Mehta for the Advanced Diabetes Care Lab.*
