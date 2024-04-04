pipeline {
    agent any
    
    environment {
        AWS_DEFAULT_REGION='us-east-1'
        DOCKERFILE_PATH = '/var/lib/jenkins/workspace/eks'
        IMAGE_REPO_NAME = "test_eks_new_new_new_new"
        IMAGE_TAG = "v1"
        REPOSITORY_URI = "${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_DEFAULT_REGION}.amazonaws.com/${IMAGE_REPO_NAME}"
    }

   
 parameters {
        string(name: 'clusterName', description: 'Name of the EKS cluster')
      string(name: 'FROM_BUILD', defaultValue: 'PROD', description: 'Build Source')
    }
    stages {

        stage('DEPLOY') {
            steps {
                echo "Deploy from source ${params.FROM_BUILD}"
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
                    withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws_cred']]) {
                        def ecrLoginCmd = "aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin ${REPOSITORY_URI}"
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
        
        stage('Create ECR Repository and testing') {
            steps {
                script {
                    def repositoryExists = sh(returnStdout: true, script: "aws ecr describe-repositories --repository-names ${IMAGE_REPO_NAME} --region us-east-1 || true").trim()
                    if (repositoryExists.contains("RepositoryName")) {
                        echo "ECR repository ${IMAGE_REPO_NAME} already exists"
                    } else {
                        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws_cred']]) {
                            sh "aws ecr create-repository --repository-name ${IMAGE_REPO_NAME} --region us-east-1"
                        }
                    }
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
        
        stage('Update kubeconfig') {
            steps {
                script {

                    sh "aws eks update-kubeconfig --region ${AWS_DEFAULT_REGION} --name ${params.clusterName"
                        
                }
            }
        }
        
        stage('Helm Deploy and testing') {
            steps {
                script {
                    // Check if the chart is already installed
                    def helmListOutput = sh(script: "helm list -A", returnStdout: true).trim()
                    def isChartInstalled = helmListOutput.contains('my-helm-chart')

                    if (isChartInstalled) {
                        // If chart is already installed, use helm upgrade
                        sh "sudo helm upgrade first my-helm-chart --namespace data-pg --set image.tag=${IMAGE_TAG}"
                    } else {
                        // If chart is not installed, use helm install
                        sh "sudo helm install first mytestchart1 --set image.tag=${IMAGE_TAG}"
                    }

                    // Check if the Spark chart is already installed
                    def helmListOutput_spark = sh(script: "helm list -A", returnStdout: true).trim()
                    def isChartInstalled_spark = helmListOutput_spark.contains('my-spark-chart')

                    if (isChartInstalled_spark) {
                        sh "sudo helm upgrade my-spark-job bitnami/spark --namespace my-namespace --set gpu.enabled=true"
                    } else {
                        sh "sudo helm install my-spark-job bitnami/spark --namespace my-namespace --set gpu.enabled=true"
                    }
                }
            }
        }
    }
}

