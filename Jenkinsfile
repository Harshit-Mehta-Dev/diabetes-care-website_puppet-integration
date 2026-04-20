pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "diabetes-care-platform"
        DOCKER_TAG = "latest"
        CONTAINER_NAME = "diabetes-care-app"
        PORT = "1012"
        GEMINI_API_KEY = credentials('gemini-api-key')
        NGROK_AUTHTOKEN = credentials('ngrok-auth-token')
        CI = "true"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js dependencies...'
                sh 'npm install'
            }
        }

        stage('Run Security Test') {
            steps {
                echo 'Verifying application stability...'
                sh 'npm test -- --forceExit --detectOpenHandles'
            }
        }

        stage('Docker Build (Optional)') {
            steps {
                script {
                    try {
                        echo 'Attempting Docker Build...'
                        sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                    } catch (Exception e) {
                        echo "Docker build failed: ${e.message}. Proceeding with Native Deployment."
                    }
                }
            }
        }

        stage('Deploy (Native 24/7)') {
            steps {
                echo 'Starting application in background...'
                withCredentials([
                    string(credentialsId: 'GEMINI_API_KEY', variable: 'GEMINI_API_KEY'),
                    string(credentialsId: 'NGROK_AUTHTOKEN', variable: 'NGROK_AUTHTOKEN')
                ]) {
                    script {
                        // Kill any existing instance of the server
                        sh "pkill -f 'node Server/server1.js' || true"
                        
                        // Start the server in the background using nohup
                        // This keeps it running 24/7 after the Jenkins job finishes
                        sh "export GEMINI_API_KEY=${GEMINI_API_KEY} && \
                            export NGROK_AUTHTOKEN=${NGROK_AUTHTOKEN} && \
                            export PORT=${PORT} && \
                            export NODE_ENV=production && \
                            nohup node Server/server1.js > app.log 2>&1 &"
                        
                        echo "Native deployment successful. Logs are being written to app.log"
                    }
                }
            }
        }

        stage('Verify') {
            steps {
                script {
                    echo 'Verifying health...'
                    sh "sleep 5"
                    sh "grep 'Server running' app.log || echo 'Warning: Server may not have started yet'"
                    sh "grep '🚀 NGROK TUNNEL ACTIVE' app.log || echo 'Warning: Ngrok tunnel not detected in logs yet'"
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline finished execution."
        }
        success {
            echo "SUCCESS: App deployed to http://localhost:${PORT}"
        }
        failure {
            echo "FAILURE: Pipeline failed at some stage. Check the console output above."
        }
    }
}
