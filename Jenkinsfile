pipeline {
   triggers {
        pollSCM('* * * * *')
    }

    agent {
        docker { image 'node:16.20.2' }
    }
   
  stages {
    stage('INSTALL'){
        steps{
            script{
                echo "========================> main test"
                sh '''
                    node -v
                    npm install
                '''
            }
        }
    }
    /*
    stage('Install') {
      steps { sh 'npm install' }
    }

    stage('MAVEN PACKAGE') {
            steps {
                script{
                    echo "========================> main test"
                    echo "${JSON_PARAMS.NEXUS_REPO_NAME}"
                    sh '''sudo cat conf_nexus_repo.xml > /opt/maven/conf/settings.xml
                     echo ${APP_VERSION}
                    mvn clean
                    mvn package -DskipTests
                    echo ${NEXUS_URL}:8081/repository/$DATABASE_URL_PROD/init_env.sh
                    '''
            }
        }
    }*/
 
    /*stage('Test') {
      parallel {
        stage('Static code analysis') {
            steps { sh 'npm run-script lint' }
        }
        stage('Unit tests') {
            steps { sh 'npm run-script test' }
        }
      }
    }
 
    stage('Build') {
      steps { sh 'npm run-script build' }
    }*/
  }
}