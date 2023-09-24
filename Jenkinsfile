pipeline {
   triggers {
        pollSCM('* * * * *')
    }

    agent any
   
  stages {
    stage('INSTALL'){
        steps{
            script{
                echo "========================> main test"
                sh '''
                    node -v
                    npm -v
                    sudo npm install
                    ls
                '''
            }
        }
    }

    stage('compile'){
        steps{
            script{
                echo "========================> main test"
                sh '''
                    sudo npm install -g @angular/cli
                    ls
                '''
            }
        }
    }


    stage('UNIT TEST'){
        steps{
            script{
                echo "========================> main test"
                sh '''
                    sudo ng build
                    ls
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

  }
}