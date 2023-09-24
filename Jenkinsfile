pipeline {
   triggers {
        pollSCM('* * * * *')
    }

    agent any
   
  stages {
    stage('MAKE ENV') {
        steps {
            script{
                echo "$NEXUS_URL:8081/repository/$DEVOPS_SCRIPTS_REPO/init_env.sh"
                sh "sudo /home/ec2-user/ebanking_backend/init_env.sh"
                echo "test: $NEXUS_USER"
                    
                sh """#!/bin/bash
                    echo START =======> install_and_config_python_modules
                    python3 -m venv ebank
                    source ebank/bin/activate
                    
                    export PYTHONPATH=.
                    pip3 install paramiko
                    pip3 install certifi

                    echo START =======> Download scripts to Nexus
                    echo curl -L -u $NEXUS_USER:$NEXUS_PASSWORD -X GET "$NEXUS_URL:8081/repository/$DEVOPS_SCRIPTS_REPO/init_env.sh" -H "accept: application/json" -o init_env.sh
                    echo curl -L -u $NEXUS_USER:$NEXUS_PASSWORD -X GET "$NEXUS_URL:8081/repository/$DEVOPS_SCRIPTS_REPO/conf_nexus_repo.xml" -H "accept: application/json" -o conf_nexus_repo.xml
                    
                    curl -L -u $NEXUS_USER:$NEXUS_PASSWORD -X GET "$NEXUS_URL:8081/repository/$DEVOPS_SCRIPTS_REPO/init_env.sh" -H "accept: application/json" -o init_env.sh
                    curl -L -u $NEXUS_USER:$NEXUS_PASSWORD -X GET "$NEXUS_URL:8081/repository/$DEVOPS_SCRIPTS_REPO/conf_nexus_repo.xml" -H "accept: application/json" -o conf_nexus_repo.xml
                    echo curl -L -u $NEXUS_USER:$NEXUS_PASSWORD -X GET "$NEXUS_URL:8081/repository/$DEVOPS_SCRIPTS_REPO/make_params.py" -H "accept: application/json" -o make_params.py
                    curl -L -u $NEXUS_USER:$NEXUS_PASSWORD -X GET "$NEXUS_URL:8081/repository/$DEVOPS_SCRIPTS_REPO/make_params.py" -H "accept: application/json" -o make_params.py
                    
                    curl -L -u $NEXUS_USER:$NEXUS_PASSWORD -X GET "$NEXUS_URL:8081/repository/$DEVOPS_SCRIPTS_REPO/stop_ebank.sh" -H "accept: application/json" -o stop_ebank.sh
                    curl -L -u $NEXUS_USER:$NEXUS_PASSWORD -X GET "$NEXUS_URL:8081/repository/$DEVOPS_SCRIPTS_REPO/start_ebank.sh" -H "accept: application/json" -o start_ebank.sh
                    curl -L -u $NEXUS_USER:$NEXUS_PASSWORD -X GET "$NEXUS_URL:8081/repository/$DEVOPS_SCRIPTS_REPO/start_app.py" -H "accept: application/json" -o start_app.py
                    
                    curl -L -u $NEXUS_USER:$NEXUS_PASSWORD -X GET "$NEXUS_URL:8081/repository/$DEVOPS_SCRIPTS_REPO/upload_file_to_server.py" -H "accept: application/json" -o upload_file_to_server.py

                    ls
                    
                    echo START =======> Make scripts executable
                    chmod +x init_env.sh
                    cat init_env.sh

                    echo START =======> execute scripts
                    python3 make_params.py pom.xml dev
                    ./init_env.sh
                    ls

                    echo START ===============> Configure ENV Params : 
                """
     
                JSON_PARAMS = readJSON file: 'data.json'

                sh """

                    echo " START ========================> Configure Nexus xml Credential (REPO ) for the correct environment"
                    sed -i 's/ENV_ROPO_NAME/${JSON_PARAMS.NEXUS_REPO_NAME}/g' conf_nexus_repo.xml
                    sed -i 's/ENV_REPO_USER_NAME/${JSON_PARAMS.NEXUS_USER}/g' conf_nexus_repo.xml
                    sed -i 's/ENV_REPO_PASSWORD/${JSON_PARAMS.NEXUS_PASSWORD}/g' conf_nexus_repo.xml

                    ls
                """       
            } 
        }
    }

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


    stage('BUILD'){
        steps{
            script{
                echo "========================> main test"
                sh '''
                    sudo ng build
                    ls
                    printenv
                '''
            }
        }
    }

    stage('MAKE ZIP FILE'){
        steps{
            script{
                PACKAGE_JSON_PARAMS = readJSON file: 'package.json';
                sh """
                    echo sudo zip ${PACKAGE_JSON_PARAMS.name}-${PACKAGE_JSON_PARAMS.version}.zip dist
                    sudo zip ${PACKAGE_JSON_PARAMS.name}-${PACKAGE_JSON_PARAMS.version}.zip dist
                    ls
                """                  
            }
        }
    }

    stage('PUSH ARTIFACTS : NEXUS ZIP FILE'){
        steps{
            script{
                PACKAGE_JSON_PARAMS = readJSON file: 'package.json';
                sh """
                    echo curl -v -u admin:devops --upload-file ${PACKAGE_JSON_PARAMS.name}-${PACKAGE_JSON_PARAMS.version}.zip ${NEXUS_URL}:8081/repository/ebankins_frontend/${PACKAGE_JSON_PARAMS.name}/${PACKAGE_JSON_PARAMS.version}/${PACKAGE_JSON_PARAMS.name}-${PACKAGE_JSON_PARAMS.version}.zip
                    curl -v -u admin:devops --upload-file ${PACKAGE_JSON_PARAMS.name}-${PACKAGE_JSON_PARAMS.version}.zip ${NEXUS_URL}:8081/repository/ebankins_frontend/${PACKAGE_JSON_PARAMS.name}/${PACKAGE_JSON_PARAMS.version}/${PACKAGE_JSON_PARAMS.name}-${PACKAGE_JSON_PARAMS.version}.zip
                """                  
            }
        }
    }

    /*
    This course enables you to upload the jar file to the environment where it will be deployed. 
    Then copy the installation scripts from this jar file to the environment in order to prepare the installation.
    */
    stage('DEPLOY APP'){
        steps{
            script{
                PACKAGE_JSON_PARAMS = readJSON file: 'package.json';
                sh """
                    python3 -m venv ebank
                    source ebank/bin/activate
                    
                    export PYTHONPATH=.
                    pip3 install paramiko
                    pip3 install certifi
                    
                    echo ${JSON_PARAMS.DEPLOY_HOST_NAME}
                    echo ${JSON_PARAMS.APP_USER}
                    echo ${JSON_PARAMS.APP_PASSWORD}
                    echo $APP_FRONTEND_DIR
                    echo ${pom.name}-${pom.version}.jar
                    printenv
                    echo Pulling... $GIT_BRANCH
                    python3 upload_file_to_server.py ${JSON_PARAMS.DEPLOY_HOST_NAME} ${JSON_PARAMS.APP_USER} ${JSON_PARAMS.APP_PASSWORD} $APP_FRONTEND_DIR ${PACKAGE_JSON_PARAMS.name}-${PACKAGE_JSON_PARAMS.version}.zip ${PACKAGE_JSON_PARAMS.name}-${PACKAGE_JSON_PARAMS.version}.zip
                    python3 upload_file_to_server.py ${JSON_PARAMS.DEPLOY_HOST_NAME} ${JSON_PARAMS.APP_USER} ${JSON_PARAMS.APP_PASSWORD} $APP_FRONTEND_DIR start_ebank.sh start_ebank.sh
                    python3 upload_file_to_server.py ${JSON_PARAMS.DEPLOY_HOST_NAME} ${JSON_PARAMS.APP_USER} ${JSON_PARAMS.APP_PASSWORD} $APP_FRONTEND_DIR stop_ebank.sh stop_ebank.sh
                    python3 upload_file_to_server.py ${JSON_PARAMS.DEPLOY_HOST_NAME} ${JSON_PARAMS.APP_USER} ${JSON_PARAMS.APP_PASSWORD} $APP_FRONTEND_DIR init_env.sh init_env.sh                          
                """                  
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
                    echo "${PACKAGE_JSON_PARAMS.NEXUS_REPO_NAME}"
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