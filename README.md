# Diabetes Care Website - Modular System

This repository has been reorganized into a modular structure to improve maintainability and security. You can find the specific components of the system in the following branches:

- **`main`**: The assembly branch containing the full project.
- **`system-server`**: Backend API and server-side logic.
- **`system-ui`**: Frontend templates and HTML pages.
- **`system-logic`**: Shared JS logic, chatbot, and trackers.
- **`system-styles`**: Global and component-specific CSS.
- **`system-infra`**: CI/CD (Jenkins), Deployment (Vercel), and Docker.
- **`system-docs`**: Project documentation and security policies.

---

# Diabetes Care Companion 🩺

A modern and responsive web application designed to help individuals manage their diabetes effectively. This application provides a suite of tools including an AI-powered chatbot, a personal profile manager, a blood sugar tracker, and a Q&A section with doctors.

## Features 🚀

*   **AI Chatbot:** 🤖 Get instant answers to your diabetes-related questions from an AI assistant powered by OpenAI's GPT-3.5-turbo model. The chatbot can provide information on medications, diet, exercise, and blood sugar management for Type 1 and Type 2 diabetes.

*   **User Profile:** 👤 Create and manage your personal health profile. You can store information such as:
    *   Full Name
    *   Age
    *   Gender
    *   Diabetes Type (Type 1 or Type 2)
    *   Current Medications

*   **Blood Sugar Tracker:** 📈 Monitor your blood sugar levels throughout the day.
    *   Log readings for different times: Morning, Afternoon, and Night.
    *   Visualize your blood sugar history with an interactive chart.
    *   The chart indicates normal, low (<70 mg/dL), and high (>180 mg/dL) blood sugar ranges.

*   **Ask a Doctor:** 👨‍⚕️ Have a specific question? Submit it to a healthcare professional through the app. You can also view a history of your past questions and their status.

## Getting Started 🏁

Follow these steps to get the project up and running on your local machine.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/diabetes-care-website.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd diabetes-care-website
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```
4.  Create a `.env` file in the `Server` directory and add your OpenAI API key:
    ```
    OPENAI_API_KEY=your_openai_api_key
    ```
5.  Start the server:
    ```bash
    npm run start
    ```

## Usage 💻

Once the server is running, open your browser and navigate to `http://localhost:3000` to use the application.

## Project Structure 📁

```
.
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
```

## Dependencies 📦

*   [body-parser](https://www.npmjs.com/package/body-parser): Node.js body parsing middleware.
*   [cors](https://www.npmjs.com/package/cors): Node.js CORS middleware.
*   [dotenv](https://www.npmjs.com/package/dotenv): Loads environment variables from a `.env` file.
*   [express](https://www.npmjs.com/package/express): Fast, unopinionated, minimalist web framework for Node.js.
*   [openai](https://www.npmjs.com/package/openai): Official OpenAI Node.js library.

## Contributing 🤝

Contributions are welcome! Please feel free to submit a pull request or open an issue if you have suggestions for improvements.

## License 📄

This project is licensed under the ISC License.
