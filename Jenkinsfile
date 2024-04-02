pipeline {
    agent any

    stages {
        stage('Checkout scm stage testing') {
            steps {
                echo 'testing'
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
        
        stage('Terraform Plan') {
            steps {
                dir('01-ekscluster-terraform-manifests') {
                    sh 'terraform plan'
                }
            }
        }
        
        stage('Terraform Apply') {
            steps {
                dir('01-ekscluster-terraform-manifests') {
                    sh 'terraform apply --auto-approve'
                }
            }
        }
        
       
    }
}
