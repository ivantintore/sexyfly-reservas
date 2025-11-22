#!/bin/bash

# SexyFly - Script de ejecución de tests
# Version: 3.0.0

echo "🧪 SexyFly - Sistema de Testing Automatizado"
echo "=============================================="
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "test.html" ]; then
    echo "❌ Error: Ejecuta este script desde el directorio raíz del proyecto"
    exit 1
fi

# Verificar si Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 no está instalado"
    exit 1
fi

# Iniciar servidor de desarrollo
echo "🚀 Iniciando servidor de pruebas en puerto 8001..."
echo ""

# Función para manejar Ctrl+C
function cleanup {
    echo ""
    echo "🛑 Deteniendo servidor de pruebas..."
    exit 0
}

trap cleanup SIGINT

# Iniciar servidor en puerto 8001 (para no conflictuar con server.py)
cd "$(dirname "$0")" || exit

echo "📡 Servidor corriendo en: http://localhost:8001/test.html"
echo "🌐 Abriendo navegador..."
echo ""
echo "💡 Presiona Ctrl+C para detener el servidor"
echo "=============================================="
echo ""

# Abrir navegador (funciona en macOS, Linux y Windows/WSL)
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "http://localhost:8001/test.html" 2>/dev/null &
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open "http://localhost:8001/test.html" 2>/dev/null &
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    # Windows
    start "http://localhost:8001/test.html" 2>/dev/null &
fi

# Iniciar servidor HTTP simple
python3 -m http.server 8001

