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

echo "=== Comprobando dataset de ejercicios ==="
if [ ! -d "compartido/exercises" ] || [ ! -f "compartido/exercises.json" ]; then
  echo "Dataset no encontrado. Descargando..."
  bash scripts/fetch-exercises-dataset.sh
  echo "Importando ejercicios a la BD..."
  node migrate_ejercicios.js
fi

echo "=== Reiniciando contenedores ==="
docker compose restart fitmeal-api fitmeal-nginx

echo "=== Listo! ==="
docker compose ps
