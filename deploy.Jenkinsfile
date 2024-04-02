pipeline {
    agent any
    
    environment {
        // Define AWS credentials and region
        // "${env.AWS_ACCOUNT_ID}"
        // "${env.AWS_DEFAULT_REGION}"
       
        // Define the path to your Dockerfile
        DOCKERFILE_PATH = '/var/lib/jenkins/workspace/eks'
        IMAGE_REPO_NAME = "test_eks"
        IMAGE_TAG = "v1"
        REPOSITORY_URI = "${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_DEFAULT_REGION}.amazonaws.com/${IMAGE_REPO_NAME}"
    }
 
    stages {
        stage('Create ECR Repository') {
            steps {
                script {
                    // Check if the ECR repository already exists
                    def repositoryExists = sh(returnStdout: true, script: "aws ecr describe-repositories --repository-names ${IMAGE_REPO_NAME} --region us-east-1 || true").trim()
                    if (repositoryExists.contains("RepositoryName")) {
                        echo "ECR repository ${IMAGE_REPO_NAME} already exists"
                    } else {
                        // Create ECR repository
                        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws_cred']]) {
                            sh "aws ecr create-repository --repository-name ${IMAGE_REPO_NAME} --region us-east-1"
                        }
                    }
                }
            }
        }
        
        stage('Cloning Git') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: '*/develop']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: '', url: 'https://github.com/pkedia009/test_new.git']]])     
            }
        }
        
        stage('Logging into AWS ECR') {
            steps {
                script {
                    // Get the AWS credentials from Jenkins credentials
                    withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws_cred']]) {
                        // Use the AWS CLI to retrieve an authentication token to use for Docker login
                        def ecrLoginCmd = "aws ecr get-login-password --region ${env.AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin ${REPOSITORY_URI}"
                        sh ecrLoginCmd
                    }
                }
            }
        }

        stage('Building image') {
            steps {
                script {
                    dockerImage = docker.build "${IMAGE_REPO_NAME}:${IMAGE_TAG}"
                }
            }
        }
        
        stage('Pushing to ECR') {
            steps {
                script {
                    sh "docker tag ${IMAGE_REPO_NAME}:${IMAGE_TAG} ${REPOSITORY_URI}:${IMAGE_TAG}"
                    sh "docker push ${REPOSITORY_URI}:${IMAGE_TAG}"
                }
            }
        }
        
        stage('Helm Deploy') {
            steps {
                script {
                    // Deploy using Helm
                    sh "helm upgrade first --install mychart --namespace helm-deployment --set image.tag=${IMAGE_TAG}"
                }
            }
        }
    }
}
