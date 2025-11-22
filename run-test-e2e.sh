#!/bin/bash

# SexyFly - Script de Test E2E (Reserva Completa)
# Version: 3.0.0

echo "🧪 SexyFly - Test E2E de Reserva Completa"
echo "=============================================="
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "test-reserva-completa.html" ]; then
    echo "❌ Error: Ejecuta este script desde el directorio raíz del proyecto"
    exit 1
fi

# Verificar si Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 no está instalado"
    exit 1
fi

echo "🚀 Iniciando servidor de pruebas E2E en puerto 8002..."
echo ""

# Función para manejar Ctrl+C
function cleanup {
    echo ""
    echo "🛑 Deteniendo servidor de pruebas..."
    exit 0
}

trap cleanup SIGINT

cd "$(dirname "$0")" || exit

echo "📡 Servidor corriendo en: http://localhost:8002/test-reserva-completa.html"
echo "🌐 Abriendo navegador..."
echo ""
echo "🎯 EL TEST SE EJECUTARÁ AUTOMÁTICAMENTE EN 4 SEGUNDOS"
echo ""
echo "💡 Presiona Ctrl+C para detener el servidor"
echo "=============================================="
echo ""
echo "📊 QUÉ HACE EL TEST:"
echo "   1. Selecciona fechas (Today+5 y Today+5+random)"
echo "   2. Rellena horarios (10:00 - 18:00)"
echo "   3. Códigos ICAO: LELL → LEBL"
echo "   4. Cliente: ivantintore@gmail.com, +34656431447"
echo "   5. Info: UNIT TESTING TEST..."
echo "   6. Acepta términos"
echo "   7. Envía formulario"
echo "   8. ✅ Verifica que todo funciona"
echo ""
echo "=============================================="
echo ""

# Abrir navegador (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    open "http://localhost:8002/test-reserva-completa.html" 2>/dev/null &
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open "http://localhost:8002/test-reserva-completa.html" 2>/dev/null &
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    start "http://localhost:8002/test-reserva-completa.html" 2>/dev/null &
fi

# Iniciar servidor
python3 -m http.server 8002

