pipeline {
    agent any

   
    stages {
  
      

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
