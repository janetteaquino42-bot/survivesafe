#!/bin/bash
# Auto-deployment script for SurviveSafe
set -e

echo "========================================="
echo "Starting Auto Deployment..."
echo "Time: $(date)"
echo "========================================="

cd ~/domains/pink-kudu-410440.hostingersite.com/laravel

# Put application in maintenance mode
echo "[1/9] Enabling maintenance mode..."
php artisan down || true

# Pull latest changes (SAFE - doesn't delete files)
echo "[2/9] Pulling latest code from GitHub..."
git config core.sshCommand "ssh -i ~/.ssh/github_survivesafe -o IdentitiesOnly=yes -F /dev/null"
git pull origin live

# Install/Update Composer dependencies
echo "[3/9] Installing Composer dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction

# Copy built assets to public_html
echo "[4/9] Copying assets to public directory..."
rsync -av --delete public/build/ ~/domains/pink-kudu-410440.hostingersite.com/public_html/build/

# Copy public files (but preserve storage)
echo "[5/9] Copying public files..."
rsync -av --exclude='storage' public/ ~/domains/pink-kudu-410440.hostingersite.com/public_html/

# Run database migrations
echo "[6/9] Running database migrations..."
php artisan migrate --force

# Clear all caches
echo "[7/9] Clearing caches..."
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

# Optimize for production
# echo "[8/9] Optimizing for production..."
# php artisan config:cache
# php artisan route:cache
# php artisan view:cache

# Disable maintenance mode
echo "[9/9] Disabling maintenance mode..."
php artisan up

echo "========================================="
echo "Deployment Complete!"
echo "Time: $(date)"
echo "========================================="
