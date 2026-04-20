pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "diabetes-care-platform"
        DOCKER_TAG = "latest"
        CONTAINER_NAME = "diabetes-care-app"
        PORT = "1012"
        GEMINI_API_KEY = credentials('gemini-api-key')
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
                bat 'npm install'
            }
        }

        stage('Run Security Test') {
            steps {
                echo 'Verifying application stability...'
                // Using --forceExit and --detectOpenHandles to prevent hanging CI builds
                sh 'npm test -- --forceExit --detectOpenHandles'
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building Docker Image...'
                bat "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
            }
        }

        stage('Cleanup Old Container') {
            steps {
                script {
                    echo 'Cleaning up old deployment...'
                    try {
                        bat "docker stop ${CONTAINER_NAME}"
                        bat "docker rm ${CONTAINER_NAME}"
                    } catch (Exception e) {
                        echo "No previous container found."
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying fresh container...'
                withCredentials([string(credentialsId: 'GEMINI_API_KEY', variable: 'GEMINI_API_KEY')]) {
                    bat "docker run -d --name ${CONTAINER_NAME} -p ${PORT}:${PORT} -e GEMINI_API_KEY=%GEMINI_API_KEY% ${DOCKER_IMAGE}:${DOCKER_TAG}"
                }
            }
        }

        stage('Verify') {
            steps {
                echo 'Verifying deployment...'
                bat "docker ps --filter name=${CONTAINER_NAME}"
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
