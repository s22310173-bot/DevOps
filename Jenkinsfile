// Pipeline CI/CD FarmCare (PHP MVC): GitHub -> Jenkins -> /var/www/html
// Lint PHP di host (php8.1), lalu deploy via deploy/deploy.sh.

pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '10'))
  }

  stages {
    stage('Checkout') {
      steps {
        ws('/opt/farmcare') {
          checkout scm
        }
      }
    }

    stage('Lint PHP') {
      steps {
        dir('/opt/farmcare') {
          sh '''
            set -e
            find . -path ./.git -prune -o -name '*.php' -print0 \
              | xargs -0 -r -n1 php8.1 -l
          '''
        }
      }
    }

    stage('Deploy') {
      steps {
        dir('/opt/farmcare') {
          sh 'bash deploy/deploy.sh'
        }
      }
    }

    stage('Verifikasi') {
      steps {
        sh '''
          set -e
          code=$(curl -s -o /dev/null -w "%{http_code}" https://juiziy.xyz/login)
          if [ "$code" != "200" ]; then
            echo "Halaman login mengembalikan HTTP $code"
            exit 1
          fi
          echo "Halaman login sehat (HTTP 200)."
        '''
      }
    }
  }
}
