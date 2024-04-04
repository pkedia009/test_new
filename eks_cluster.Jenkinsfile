def buildReleaseJob(clusterName) {
    echo "EKS cluster created successfully for ${params.TARGET_ENV} environment. Triggering release job..."
    build job: 'releasejob_spark',
        parameters: [
            string(name: 'FROM_BUILD', value: "${BUILD_NUMBER}"),
            string(name: 'CLUSTER_NAME', value: clusterName)
        ]
}

pipeline {
    agent any

    parameters {
        choice(name: 'TARGET_ENV', choices: ['qa', 'dev', 'prod'], description: 'Environment')
    }

    stages {
        stage("CREATE_EKS_CLUSTER") {
            steps {
                dir('01-ekscluster-terraform-manifests') {
                    script {
                        def workspaceName = params.TARGET_ENV
                        sh "terraform workspace select ${workspaceName} || terraform workspace new ${workspaceName}"
                        sh 'terraform init'
                    }
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
                    // Retrieve cluster name from Terraform output
                    def clusterName = sh(script: 'terraform output -json', returnStdout: true).trim()
                    // Pass the cluster name to the next stage
                    buildReleaseJob(clusterName)
                }
            }
        }

        stage("TRIGGER_RELEASE_JOB") {
            steps {
                // Call the buildReleaseJob function
                buildReleaseJob(clusterName)
            }
        }
    }
}
