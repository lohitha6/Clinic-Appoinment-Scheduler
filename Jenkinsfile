pipeline {
    agent any
    
    environment {
        DOCKER_REPO = 'lohitha12100706/clinic-scheduler'
        DOCKER_CREDS = credentials('dockerhub-credentials')
        KUBE_CONFIG = credentials('kubeconfig')
        IMAGE_TAG = "${BUILD_NUMBER}"
    }
    
    triggers {
        pollSCM('H/5 * * * *')
    }
    
    stages {
        stage('Checkout') {
            when { branch 'main' }
            steps {
                checkout scm
                script {
                    env.GIT_COMMIT = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
                }
            }
        }
        
        stage('SonarCloud Analysis') {
            agent {
                docker {
                    image 'sonarsource/sonar-scanner-cli:latest'
                }
            }
            
            steps {
                withSonarQubeEnv('SonarCloud') {
                    sh '''
                        sonar-scanner \
                          -Dsonar.projectKey=clinic-scheduler \
                          -Dsonar.organization=lohitha6 \
                          -Dsonar.sources=. \
                          -Dsonar.host.url=https://sonarcloud.io \
                          -Dsonar.login=af7fa01eab721ed77b75def75062db59f0cea714
                    '''
                }
            }
        }
        
        stage('Docker Build') {
            when { branch 'main' }
            steps {
                script {
                    def image = docker.build("${DOCKER_REPO}:${IMAGE_TAG}")
                    docker.build("${DOCKER_REPO}:latest")
                }
            }
        }
        
        stage('Push to Docker Hub') {
            when { branch 'main' }
            steps {
                script {
                    docker.withRegistry('', 'dockerhub-credentials') {
                        docker.image("${DOCKER_REPO}:${IMAGE_TAG}").push()
                        docker.image("${DOCKER_REPO}:latest").push()
                    }
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            when { branch 'main' }
            steps {
                withKubeConfig([credentialsId: 'kubeconfig']) {
                    sh """
                        helm upgrade --install clinic-scheduler ./helm-chart \
                            --set image.repository=${DOCKER_REPO} \
                            --set image.tag=${IMAGE_TAG} \
                            --set service.port=4200 \
                            --set service.targetPort=3000 \
                            --namespace production \
                            --create-namespace
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo "✅ Build ${BUILD_NUMBER} completed successfully"
            echo "✅ Clinic Scheduler deployed successfully"
            echo "Docker: ${DOCKER_REPO}:${IMAGE_TAG}"
        }
        failure {
            echo "❌ Build ${BUILD_NUMBER} failed"
        }
    }
}