pipeline {
    options {
        timeout(time: 45, unit: 'MINUTES')
    }
    agent any
    environment {
        DOCKER_BUILD_TAG = sh(returnStdout: true, script: "git describe --tags")
    }
    stages {
        stage('Checkout') {
            steps {
                dir(path: 'edge-cloud-ui') {
                    git url: 'git@github.com:mobiledgex/edge-cloud-ui.git'
                }
                script {
                    dir(path: 'edge-cloud-ui') {
                        currentBuild.displayName = "${DOCKER_BUILD_TAG}"
                    }
                }
            }
        }
        stage('Docker Image') {
            steps {
                dir(path: 'edge-cloud-ui') {
                    sh "make build && make publish"
                }
            }
        }
        stage('Deploy') {
            when {
                 tag comparator: 'REGEXP', pattern: '^v[0-9\\.]$'
            }
            steps {
                build job: 'console-deploy',
                      parameters: [string(name: 'TAG', value: "${DOCKER_BUILD_TAG}"), string(name: 'DEPLOY_ENVIRONMENT', value: 'staging')]
            }
        }
    }
    post {
        success {
            slackSend color: 'good', message: "Build Successful - ${env.JOB_NAME} #${env.BUILD_NUMBER} (<${env.RUN_DISPLAY_URL}|Open>)"
        }
        failure {
            slackSend color: 'warning', message: "Build Failed - ${env.JOB_NAME} #${env.BUILD_NUMBER} (<${env.RUN_DISPLAY_URL}|Open>)"
        }
    }
}
