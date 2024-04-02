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
        
        stage('Terraform Action') {
            steps {
                dir('01-ekscluster-terraform-manifests') {
                    // Prompt user for Terraform action
                    script {
                        def userInput = input(
                            id: 'UserInput',
                            message: 'Choose Terraform action',
                            parameters: [
                                choice(name: 'ACTION', choices: ['apply', 'destroy'], description: 'Choose Terraform action to apply or destroy infrastructure')
                            ]
                        )
                        // Retrieve chosen action from user input
                        def action = userInput.ACTION
                        echo "Terraform action is --> ${action}"
                        
                        // Execute Terraform command based on chosen action
                        sh "terraform ${action} --auto-approve"
                    }
                }
            }
        }
    }
}
