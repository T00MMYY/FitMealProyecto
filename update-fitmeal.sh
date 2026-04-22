#!/bin/bash
set -e
echo "=== Actualizando FitMeal ==="
cd ~/projects/fitmeal

git pull origin main

echo "=== Building frontend ==="
cd frontend
npm install --silent
npm run build
cd ..

echo "=== Reiniciando contenedores ==="
docker compose restart fitmeal-api fitmeal-nginx

echo "=== Listo! ==="
docker compose ps
