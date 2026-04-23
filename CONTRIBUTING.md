# Contributing to Diabetes Care App

First off, thank you for considering contributing to the Diabetes Care platform! It’s people like you who make health-tech tools more accessible and effective.

Please take a moment to review these guidelines to ensure a smooth development process.

---

## 🛠️ Getting Started

1.  **Fork** the repository to your own GitHub account.
2.  **Clone** the fork to your local machine:
    ```bash
    git clone [https://github.com/harshit-mehta-lab/diabetes-care-website.git](https://github.com/harshit-mehta-lab/diabetes-care-website.git)
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```
4.  **Set up Environment Variables**: Create a `.env` file in the root directory and add your `OPENAI_API_KEY`.

---

## 🌿 Branching Strategy

To keep the repository organized, please use the following naming conventions for your branches:

* **`feature-ui/your-feature`**: For any changes related to CSS, layout, or frontend interactions.
* **`feature-api/your-feature`**: For backend logic, Express routes, or AI chatbot integration.
* **`fix/bug-name`**: For resolving existing issues or bugs.

---

## 🚦 CI/CD & Development Standards

This project utilizes a **Zero-Click Jenkins Pipeline**. Every push is automatically built and tested.

1.  **Code Quality**: Ensure your JavaScript is clean and follows modern ES6 standards.
2.  **Aesthetic Consistency**: All UI contributions must adhere to the **"Cyber-Cloud Dashboard"** aesthetic (Dark mode, high-contrast industrial design, vibrant animations). Avoid glassmorphism.
3.  **Passing Builds**: Before submitting a Pull Request, ensure that the Jenkins status check on your branch is **Green (Success)**. Pull Requests with failing status checks (Red X) will not be reviewed.

---

## 📥 Submitting a Pull Request (PR)

1.  **Commit** your changes with a descriptive message:
    ```bash
    git commit -m "feat: added real-time HbA1c estimation logic"
    ```
2.  **Push** to your fork:
    ```bash
    git push origin feature-ui/your-feature-name
    ```
3.  **Open a PR** against the `main` branch. 
4.  Provide a clear summary of what you changed and why. If it fixes a bug, link the issue using `Closes #IssueNumber`.

---

## 💬 Communication
If you have questions or want to discuss a large feature before building it, please open an **Issue** with the tag `discussion`. 

Thank you for helping us build better tools for diabetes management!
