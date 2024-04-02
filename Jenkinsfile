pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Terraform Init') {
            steps {
                dir('01-ekscluster-terraform-manifests') {
                    sh 'terraform init -reconfigure'
                }
            }
        }
        
       
    }
}
