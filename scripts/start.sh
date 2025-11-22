#!/bin/bash
# SexyFly - Script de Inicio
# Version: 3.0.0

clear
echo "🚀 SexyFly Reservas v3.0.0"
echo "=============================================="
echo ""

# Ir al directorio raíz del proyecto
cd "$(dirname "$0")/.." || exit

# Activar venv si existe
if [ -d "venv" ]; then
    echo "📦 Activando entorno virtual..."
    source venv/bin/activate
else
    echo "ℹ️  Usando Python del sistema (venv no necesario)"
fi

echo "🌐 Iniciando servidor de desarrollo..."
echo ""

# Ejecutar servidor
python3 scripts/server.py
