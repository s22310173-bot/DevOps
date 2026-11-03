// Pipeline CI/CD FarmCare: GitHub → Jenkins (di VPS) → Docker Compose → https://juiziy.xyz
// Tidak butuh Node di host: lint dan build frontend berjalan di dalam container.

pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '10'))
  }

  // Repo produksi (dengan file .env) berada di /opt/farmcare; job pipeline
  // tidak mendukung custom workspace, jadi setiap stage diarahkan ke sana.
  stages {
    stage('Checkout') {
      steps {
        ws('/opt/farmcare') {
          checkout scm
        }
      }
    }

    stage('Lint') {
      steps {
        dir('/opt/farmcare') {
          sh 'docker build --target lint -t farmcare/lint .'
        }
      }
    }

    stage('Build image & deploy') {
      steps {
        dir('/opt/farmcare') {
          sh 'docker compose build'
          sh 'docker compose run --rm -T api npm run db:push'
          sh 'docker compose up -d --wait'
        }
      }
    }

    stage('Verifikasi') {
      steps {
        dir('/opt/farmcare') {
          sh '''
            set -e
            docker compose exec -T api node -e "fetch('http://127.0.0.1:3001/api/health').then(r => r.json()).then(j => { if (j.status !== 'ok') process.exit(1) }).catch(() => process.exit(1))"
            docker compose exec -T web wget -qO- http://127.0.0.1/healthz | grep -q ok
            echo "API dan web sehat."
            if curl -kfsS --max-time 10 https://juiziy.xyz/api/health; then
              echo "TLS dari luar OK."
            else
              echo "CATATAN: TLS eksternal belum siap (wajar pada deploy pertama; sertifikat Let's Encrypt butuh beberapa detik/menit)."
            fi
          '''
        }
      }
    }
  }

  post {
    failure {
      dir('/opt/farmcare') {
        sh 'docker compose logs --tail=80 || true'
      }
    }
    always {
      sh 'docker image prune -f || true'
    }
  }
}
