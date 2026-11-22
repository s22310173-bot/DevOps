#!/usr/bin/env bash
# Sinkronkan source aplikasi ke docroot Apache lalu reload.
# Pemakaian: deploy/deploy.sh [source-dir]
set -euo pipefail

SRC_DIR="${1:-$(cd "$(dirname "$0")/.." && pwd)}"
TARGET="${TARGET:-/var/www/html/devops}"

sudo rsync -a --delete \
  --exclude '.git' \
  --exclude '.env' \
  --exclude 'deploy' \
  --exclude 'docs' \
  --exclude 'Jenkinsfile' \
  --exclude 'README.md' \
  --exclude 'CONTEXT.md' \
  --exclude '.gitignore' \
  --exclude '.env.example' \
  "$SRC_DIR/" "$TARGET/"

sudo chown -R juiziy:www-data "$TARGET"
sudo find "$TARGET" -type d -exec chmod 775 {} +
sudo find "$TARGET" -type f -exec chmod 664 {} +
[ -f "$TARGET/.env" ] && sudo chmod 640 "$TARGET/.env"

sudo systemctl reload apache2
echo "Deploy selesai ke $TARGET"
