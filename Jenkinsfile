pipeline {
   triggers {
        pollSCM('* * * * *')
    }

    agent any
   
  stages {
    stage('MAKE ENV') {
        steps {
            script{
                JSON_PKG = readJSON file: 'package.json';

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
                    echo curl -L -u $NEXUS_USER:$NEXUS_PASSWORD -X GET "$NEXUS_URL:8081/repository/$DEVOPS_SCRIPTS_REPO/make_params_front.py" -H "accept: application/json" -o make_params_front.py
                    curl -L -u $NEXUS_USER:$NEXUS_PASSWORD -X GET "$NEXUS_URL:8081/repository/$DEVOPS_SCRIPTS_REPO/make_params_front.py" -H "accept: application/json" -o make_params_front.py
                    
                    curl -L -u $NEXUS_USER:$NEXUS_PASSWORD -X GET "$NEXUS_URL:8081/repository/$DEVOPS_SCRIPTS_REPO/stop_ebank.sh" -H "accept: application/json" -o stop_ebank.sh
                    curl -L -u $NEXUS_USER:$NEXUS_PASSWORD -X GET "$NEXUS_URL:8081/repository/$DEVOPS_SCRIPTS_REPO/start_ebank_front.sh" -H "accept: application/json" -o start_ebank_front.sh
                    curl -L -u $NEXUS_USER:$NEXUS_PASSWORD -X GET "$NEXUS_URL:8081/repository/$DEVOPS_SCRIPTS_REPO/start_app.py" -H "accept: application/json" -o start_app.py
                    
                    curl -L -u $NEXUS_USER:$NEXUS_PASSWORD -X GET "$NEXUS_URL:8081/repository/$DEVOPS_SCRIPTS_REPO/upload_file_to_server.py" -H "accept: application/json" -o upload_file_to_server.py

                    ls
                    
                    echo START =======> Make scripts executable
                    chmod +x init_env.sh
                    cat init_env.sh

                    echo START =======> execute scripts
                    echo python3 make_params_front.py ${JSON_PKG.name} ${JSON_PKG.version} dev
                    python3 make_params_front.py ${JSON_PKG.name} ${JSON_PKG.version} dev
                    ls

                    echo START ===============> Configure ENV Params : 
                """
     
                JSON_PARAMS = readJSON file: 'data.json'
   
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
                sh """
                    echo sudo -r zip ${JSON_PARAMS.APP_NAME}-${JSON_PARAMS.APP_VERSION}.zip dist
                    sudo zip -r ${JSON_PARAMS.APP_NAME}-${JSON_PARAMS.APP_VERSION}.zip dist
                    ls
                """                  
            }
        }
    }

    stage('PUSH ARTIFACTS : NEXUS ZIP FILE'){
        steps{
            script{
                sh """
                    echo curl -v -u admin:devops --upload-file ${JSON_PARAMS.APP_NAME}-${JSON_PARAMS.APP_VERSION}.zip ${NEXUS_URL}:8081/repository/ebankins_frontend/${JSON_PARAMS.APP_NAME}/${JSON_PARAMS.APP_VERSION}/${JSON_PARAMS.APP_NAME}-${JSON_PARAMS.APP_VERSION}.zip
                    curl -v -u admin:devops --upload-file ${JSON_PARAMS.APP_NAME}-${JSON_PARAMS.APP_VERSION}.zip ${NEXUS_URL}:8081/repository/ebankins_frontend/${JSON_PARAMS.APP_NAME}/${JSON_PARAMS.APP_VERSION}/${JSON_PARAMS.APP_NAME}-${JSON_PARAMS.APP_VERSION}.zip
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
                sh """
                    python3 -m venv ebank
                    source ebank/bin/activate
                    
                    export PYTHONPATH=.
                    pip3 install paramiko
                    pip3 install certifi
                    
                    echo ${JSON_PARAMS.DEPLOY_HOST_NAME}
                    echo ${JSON_PARAMS.APP_USER}
                    echo ${JSON_PARAMS.APP_PASSWORD}
                    echo ${JSON_PARAMS.APP_PATH}
                    echo ${JSON_PARAMS.APP_NAME}-${JSON_PARAMS.APP_VERSION}.zip
                    printenv
                    echo Pulling... $GIT_BRANCH
                    python3 upload_file_to_server.py ${JSON_PARAMS.DEPLOY_HOST_NAME} ${JSON_PARAMS.APP_USER} ${JSON_PARAMS.APP_PASSWORD} ${JSON_PARAMS.APP_PATH} ${JSON_PARAMS.APP_NAME}-${JSON_PARAMS.APP_VERSION}.zip ${JSON_PARAMS.APP_NAME}-${JSON_PARAMS.APP_VERSION}.zip
                    python3 upload_file_to_server.py ${JSON_PARAMS.DEPLOY_HOST_NAME} ${JSON_PARAMS.APP_USER} ${JSON_PARAMS.APP_PASSWORD} ${JSON_PARAMS.APP_PATH} start_ebank_front.sh start_ebank_front.sh                         
                """                  
            }
        }
    }

    stage('LAUNCH FRONT APP'){
        steps{
            script{
                sh """
                    python3 -m venv ebank
                    source ebank/bin/activate
                    
                    export PYTHONPATH=.
                    pip3 install paramiko
                    pip3 install certifi

                    echo Pulling... $GIT_BRANCH
                    printenv
                    echo python3 start_app.py ${JSON_PARAMS.DEPLOY_HOST_NAME} ${JSON_PARAMS.APP_USER} ${JSON_PARAMS.APP_PASSWORD} ${JSON_PARAMS.APP_PATH} ${JSON_PARAMS.NEXUS_REPO_NAME} start_ebank_front.sh ${JSON_PARAMS.APP_NAME}-${JSON_PARAMS.APP_VERSION}.zip zip
                    python3 start_app.py ${JSON_PARAMS.DEPLOY_HOST_NAME} ${JSON_PARAMS.APP_USER} ${JSON_PARAMS.APP_PASSWORD} ${JSON_PARAMS.APP_PATH} ${JSON_PARAMS.NEXUS_REPO_NAME} start_ebank_front.sh ${JSON_PARAMS.APP_NAME}-${JSON_PARAMS.APP_VERSION}.zip zip                      
                """                  
            }
        }
    }
  }
}