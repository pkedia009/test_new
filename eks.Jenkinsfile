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
                        sh "terraform workspace new ${workspaceName}"
                        sh "terraform workspace select ${workspaceName}"
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
                }
            }
        }
        
        stage("TRIGGER_RELEASE_JOB") {
            when {
                beforeAgent true
                expression {
                    def workspaceName = params.TARGET_ENV
                    return sh(script: "terraform workspace select ${workspaceName}", returnStatus: true) == 0
                }
            }
            steps {
                echo "EKS cluster created successfully for ${params.TARGET_ENV} environment. Triggering release job..."
                build job: 'ReleaseJob',
                      parameters: [
                          string(name: 'FROM_BUILD', value: "${BUILD_NUMBER}")
                      ]
            }
        }
    }
}
