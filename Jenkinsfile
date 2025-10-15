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
                            --set service.targetPort=3002 \
                            --namespace production \
                            --create-namespace
                    """
                }
            }
        }
        
        stage('Deploy Prometheus') {
            when { branch 'main' }
            steps {
                withKubeConfig([credentialsId: 'kubeconfig']) {
                    sh """
                        helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
                        helm repo update
                        
                        helm upgrade --install prometheus prometheus-community/kube-prometheus-stack \
                            --namespace monitoring \
                            --create-namespace \
                            --set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false
                    """
                }
            }
        }
        
        stage('Configure Monitoring') {
            when { branch 'main' }
            steps {
                withKubeConfig([credentialsId: 'kubeconfig']) {
                    sh """
                        kubectl apply -f - <<EOF
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: clinic-scheduler-monitor
  namespace: production
  labels:
    app: clinic-scheduler
spec:
  selector:
    matchLabels:
      app: clinic-scheduler
  endpoints:
  - port: http
    path: /metrics
    interval: 30s
EOF
                    """
                }
            }
        }
        
        stage('Verify Monitoring') {
            when { branch 'main' }
            steps {
                withKubeConfig([credentialsId: 'kubeconfig']) {
                    sh """
                        kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=prometheus \
                            --namespace=monitoring --timeout=300s
                        
                        kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=grafana \
                            --namespace=monitoring --timeout=300s
                        
                        echo "Grafana admin password:"
                        kubectl get secret prometheus-grafana \
                            --namespace=monitoring \
                            -o jsonpath="{.data.admin-password}" | base64 --decode
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo "✅ Build ${BUILD_NUMBER} completed successfully"
            echo "✅ Clinic Scheduler deployed successfully"
            echo "✅ Prometheus & Grafana monitoring deployed"
            echo "Docker: ${DOCKER_REPO}:${IMAGE_TAG}"
        }
        failure {
            echo "❌ Build ${BUILD_NUMBER} failed"
        }
    }
}