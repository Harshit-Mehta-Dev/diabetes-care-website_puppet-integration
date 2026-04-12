pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        // Assuming Jenkins needs cross-env or testing tool commands to use ci mode
        CI = 'true'
    }

    tools {
        nodejs 'node' 
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies from package.json...'
                bat 'npm ci' // Use "npm ci" in CI/CD for reliable lockfile-based installs
            }
        }

        stage('Security & Dependency Monitoring') {
            steps {
                echo 'Running automated security monitoring for vulnerabilities...'
                // Fails the stage but lets the build complete if high vulnerabilities are found
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    bat 'npm audit --audit-level=high'
                }
            }
        }

        stage('Test') {
            steps {
                echo 'Running Jest test suites...'
                bat 'npm test'
            }
        }

        stage('Build & Archive') {
            steps {
                echo 'Archiving necessary artifacts for deployment...'
                // Exclude node_modules so that the raw source and dependencies can be built separately on target
                // Or Jenkins could archive the exact deployment build
                archiveArtifacts artifacts: 'Server/**/*, public/**/*, package.json, package-lock.json', allowEmptyArchive: false
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution finished.'
        }
        success {
            echo 'Pipeline successfully executed! Artifacts are archived and ready for deployment.'
        }
        failure {
            echo 'Pipeline failed during execution. Check logs above.'
        }
    }
}
