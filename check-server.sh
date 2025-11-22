#!/bin/bash
# Script para verificar el estado del servidor

echo "🔍 Verificando estado del servidor..."
echo ""

# Verificar si el puerto está en uso
if lsof -ti:8000 > /dev/null 2>&1; then
    echo "✅ Servidor corriendo en puerto 8000"
    echo ""
    echo "🌐 URLs disponibles:"
    echo "   - http://localhost:8000/index.html"
    echo "   - http://127.0.0.1:8000/index.html"
    echo ""
    
    # Probar conexión
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/index.html | grep -q "200"; then
        echo "✅ Servidor responde correctamente"
        echo ""
        echo "💡 Abre tu navegador y visita:"
        echo "   http://localhost:8000/index.html"
        echo ""
        echo "O ejecuta:"
        echo "   open http://localhost:8000/index.html"
    else
        echo "⚠️  Servidor corriendo pero no responde correctamente"
    fi
else
    echo "❌ Servidor NO está corriendo"
    echo ""
    echo "💡 Para iniciarlo, ejecuta:"
    echo "   ./start.sh"
    echo "   o"
    echo "   python3 server.py"
fi

