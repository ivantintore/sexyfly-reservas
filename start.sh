#!/bin/bash
# Script de inicio rápido para SexyFly Reservas

echo "🚀 Iniciando SexyFly Reservas..."
echo ""

# Activar venv si existe
if [ -d "venv" ]; then
    echo "📦 Activando entorno virtual..."
    source venv/bin/activate
else
    echo "⚠️  No se encontró venv, usando Python del sistema"
fi

# Iniciar servidor
echo "🌐 Iniciando servidor en http://localhost:8000"
echo ""
python3 server.py


