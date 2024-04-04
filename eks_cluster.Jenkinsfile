pipeline {
    agent any

    parameters {
        choice(name: 'TARGET_ENV', choices: ['qa', 'dev', 'prod'], description: 'Environment')
    }

    stages {
        stage("CREATE_EKS_CLUSTER") {
            steps {
                script {
                    def workspaceName = params.TARGET_ENV
                    // Check if the workspace exists
                    def workspaceExists = sh(script: "terraform workspace select ${workspaceName}", returnStatus: true) == 0
                    if (!workspaceExists) {
                        // If workspace does not exist, create a new one
                        sh "terraform workspace new ${workspaceName}"
                        sh "terraform workspace select ${workspaceName}"
                    }
                    // Initialize the Terraform backend with reconfiguration
                    sh 'terraform init -reconfigure'
                }
            }
        }

        stage("VALIDATE_TERRAFORM") {
            steps {
                dir('01-ekscluster-terraform-manifests') {
                    sh 'terraform validate'
                }
            }
        }

        stage("TERRAFORM_PLAN") {
            steps {
                dir('01-ekscluster-terraform-manifests') {
                    sh 'terraform plan'
                }
            }
        }

        stage("APPLY_TERRAFORM") {
            steps {
                dir('01-ekscluster-terraform-manifests') {
                    sh 'terraform apply -auto-approve'
                }
            }
        }

        stage("TRIGGER_RELEASE_JOB") {
            steps {
                script {
                    def clusterName = sh(script: 'terraform output -json', returnStdout: true).trim()
                    echo "EKS cluster created successfully for ${params.TARGET_ENV} environment. Triggering release job..."
                    build job: 'releasejob_spark',
                        parameters: [
                            string(name: 'FROM_BUILD', value: "${BUILD_NUMBER}"),
                            string(name: 'CLUSTER_NAME', value: clusterName)
                        ]
                }
            }
        }
    }
}
