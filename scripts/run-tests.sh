#!/bin/bash

# SexyFly - Script de ejecución de tests unitarios
# Version: 3.0.0

echo "🧪 SexyFly - Tests Unitarios (34 tests)"
echo "=============================================="
echo ""

# Ir al directorio raíz
cd "$(dirname "$0")/.." || exit

# Verificar que test.html existe
if [ ! -f "tests/test.html" ]; then
    echo "❌ Error: tests/test.html no encontrado"
    exit 1
fi

# Verificar Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 no está instalado"
    exit 1
fi

echo "🚀 Iniciando servidor de tests en puerto 8001..."
echo ""

# Función para cleanup
function cleanup {
    echo ""
    echo "🛑 Deteniendo servidor de tests..."
    exit 0
}

trap cleanup SIGINT

echo "📡 Servidor: http://localhost:8001/tests/test.html"
echo "🌐 Abriendo navegador..."
echo ""
echo "💡 Presiona Ctrl+C para detener"
echo "=============================================="
echo ""

# Abrir navegador
if [[ "$OSTYPE" == "darwin"* ]]; then
    open "http://localhost:8001/tests/test.html" 2>/dev/null &
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open "http://localhost:8001/tests/test.html" 2>/dev/null &
fi

# Iniciar servidor
python3 -m http.server 8001
