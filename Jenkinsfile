pipeline {
    agent {
        kubernetes {
            // Используем pod с Docker для сборки
        yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: jnlp
    image: jenkins/inbound-agent:latest
    args: ['\$(JENKINS_SECRET)', '\$(JENKINS_NAME)']
  - name: kaniko
    image: gcr.io/kaniko-project/executor:latest
    command: ["/busybox/cat"]
    tty: true
    volumeMounts:
      - name: kaniko-secret
        mountPath: /kaniko/.docker
  volumes:
    - name: kaniko-secret
      secret:
        secretName: docker-config
        items:
          - key: .dockerconfigjson
            path: config.json
'''
        }
    }
    
    environment {
        // Настройки registry
        DOCKER_REGISTRY = 'your-registry.example.com'
        DOCKER_CREDENTIALS_ID = 'docker-registry-credentials'
        // Имя образа
        IMAGE_NAME = "your-image-name"
        // Тег образа (можно использовать номер сборки)
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Получаем исходный код из SCM
                checkout scm
            }
        }
        
        stage('Build Docker Image') {
            steps {
                container('docker') {
                    // Логинимся в registry (если требуется аутентификация)
                    withCredentials([usernamePassword(
                        credentialsId: env.DOCKER_CREDENTIALS_ID,
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh """
                            docker login -u $DOCKER_USER -p $DOCKER_PASS ${env.DOCKER_REGISTRY}
                        """
                    }
                    
                    // Собираем Docker-образ
                    sh """
                        docker build -t ${env.DOCKER_REGISTRY}/${env.IMAGE_NAME}:${env.IMAGE_TAG} .
                        docker build -t ${env.DOCKER_REGISTRY}/${env.IMAGE_NAME}:latest .
                    """
                }
            }
        }
        
        stage('Push Docker Image') {
            steps {
                container('docker') {
                    // Пушим образ в registry
                    sh """
                        docker push ${env.DOCKER_REGISTRY}/${env.IMAGE_NAME}:${env.IMAGE_TAG}
                        docker push ${env.DOCKER_REGISTRY}/${env.IMAGE_NAME}:latest
                    """
                }
            }
        }
    }
    
    post {
        always {
            // Очистка после сборки
            container('docker') {
                sh """
                    docker rmi ${env.DOCKER_REGISTRY}/${env.IMAGE_NAME}:${env.IMAGE_TAG} || true
                    docker rmi ${env.DOCKER_REGISTRY}/${env.IMAGE_NAME}:latest || true
                """
            }
        }
    }
}
