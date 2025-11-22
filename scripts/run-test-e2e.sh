#!/bin/bash

# SexyFly - Script de Test E2E (Reserva Completa)
# Version: 3.0.0

echo "🧪 SexyFly - Test E2E (Reserva Completa)"
echo "=============================================="
echo ""

# Ir al directorio raíz
cd "$(dirname "$0")/.." || exit

# Verificar archivo
if [ ! -f "tests/test-reserva-completa.html" ]; then
    echo "❌ Error: tests/test-reserva-completa.html no encontrado"
    exit 1
fi

# Verificar Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 no está instalado"
    exit 1
fi

echo "🚀 Iniciando servidor de tests E2E en puerto 8002..."
echo ""

function cleanup {
    echo ""
    echo "🛑 Deteniendo servidor..."
    exit 0
}

trap cleanup SIGINT

echo "📡 URL: http://localhost:8002/tests/test-reserva-completa.html"
echo "🌐 Abriendo navegador..."
echo ""
echo "🎯 EL TEST SE AUTO-EJECUTA EN 4 SEGUNDOS"
echo ""
echo "📊 QUÉ HACE:"
echo "   1. Selecciona fechas (Today+5 y Today+5+random)"
echo "   2. Rellena LELL → LEBL"
echo "   3. Email: ivantintore@gmail.com"
echo "   4. Teléfono: +34656431447"
echo "   5. Info: UNIT TESTING TEST..."
echo "   6. Envía formulario"
echo "   7. ✅ Verifica todo funciona"
echo ""
echo "💡 Presiona Ctrl+C para detener"
echo "=============================================="
echo ""

# Abrir navegador
if [[ "$OSTYPE" == "darwin"* ]]; then
    open "http://localhost:8002/tests/test-reserva-completa.html" 2>/dev/null &
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open "http://localhost:8002/tests/test-reserva-completa.html" 2>/dev/null &
fi

# Iniciar servidor
python3 -m http.server 8002
