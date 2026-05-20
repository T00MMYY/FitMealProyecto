#!/bin/bash
# Descarga el dataset de free-exercise-db (ejercicios + imágenes JPG)
# y lo coloca en compartido/ para que nginx lo sirva en /exercises/
# Se ejecuta una vez en setup; idempotente si el dataset ya existe.

set -e

REPO_URL="https://github.com/yuhonas/free-exercise-db.git"
TMP_DIR="/tmp/free-exercise-db"
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DEST_JSON="$PROJECT_DIR/compartido/exercises.json"
DEST_IMAGES="$PROJECT_DIR/compartido/exercises"

echo "=== FitMeal — fetch exercises dataset ==="

if [ -d "$DEST_IMAGES" ] && [ -f "$DEST_JSON" ]; then
  echo "Dataset ya existe en compartido/."
  read -r -p "¿Sobrescribir? [s/N]: " resp
  if [[ ! "$resp" =~ ^[sS]$ ]]; then
    echo "Cancelado. Dataset sin cambios."
    exit 0
  fi
  rm -rf "$DEST_IMAGES"
fi

echo "Clonando $REPO_URL (solo rama main, sin historial)..."
rm -rf "$TMP_DIR"
git clone --depth 1 --branch main "$REPO_URL" "$TMP_DIR"

mkdir -p "$PROJECT_DIR/compartido"

echo "Copiando exercises.json..."
cp "$TMP_DIR/dist/exercises.json" "$DEST_JSON"

echo "Copiando imágenes de ejercicios..."
cp -r "$TMP_DIR/exercises" "$DEST_IMAGES"

echo "Limpiando directorio temporal..."
rm -rf "$TMP_DIR"

TOTAL=$(find "$DEST_IMAGES" -name "*.jpg" | wc -l)
SIZE=$(du -sh "$DEST_IMAGES" | cut -f1)
echo ""
echo "Listo."
echo "  Imágenes: $TOTAL JPGs en compartido/exercises/ ($SIZE)"
echo "  JSON:     compartido/exercises.json"
echo ""
echo "Siguiente paso: node migrate_ejercicios.js"
