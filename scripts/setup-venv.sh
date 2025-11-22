#!/bin/bash

# SexyFly - Script de Setup de Entorno Virtual
# Version: 3.0.0

echo "📦 SexyFly - Setup de Entorno Virtual"
echo "=============================================="
echo ""

# Verificar Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 no está instalado"
    echo "   Instala Python 3.7+ desde https://www.python.org"
    exit 1
fi

PYTHON_VERSION=$(python3 --version)
echo "✅ Python encontrado: $PYTHON_VERSION"
echo ""

# Verificar si ya existe venv
if [ -d "venv" ]; then
    echo "⚠️  Ya existe un entorno virtual"
    read -p "¿Quieres eliminarlo y crear uno nuevo? (s/N): " respuesta
    
    if [[ "$respuesta" =~ ^[Ss]$ ]]; then
        echo "🗑️  Eliminando venv antiguo..."
        rm -rf venv
    else
        echo "✅ Manteniendo venv existente"
        echo ""
        echo "Para activarlo:"
        echo "   source venv/bin/activate"
        exit 0
    fi
fi

# Crear venv
echo "🔨 Creando entorno virtual..."
python3 -m venv venv

if [ ! -d "venv" ]; then
    echo "❌ Error: No se pudo crear el entorno virtual"
    exit 1
fi

echo "✅ Entorno virtual creado"
echo ""

# Activar venv
echo "📥 Activando entorno virtual..."
source venv/bin/activate

# Actualizar pip
echo "⬆️  Actualizando pip..."
pip install --upgrade pip --quiet

# Instalar dependencias (si existen en requirements.txt)
if [ -f "requirements.txt" ]; then
    echo "📦 Instalando dependencias desde requirements.txt..."
    
    # Contar líneas no vacías y no comentadas
    DEPS=$(grep -v '^#' requirements.txt | grep -v '^$' | wc -l | tr -d ' ')
    
    if [ "$DEPS" -gt 0 ]; then
        pip install -r requirements.txt
        echo "✅ $DEPS dependencia(s) instalada(s)"
    else
        echo "ℹ️  requirements.txt está vacío (no hay dependencias)"
        echo "   Este proyecto solo usa librerías estándar de Python"
    fi
else
    echo "⚠️  No se encontró requirements.txt"
fi

echo ""
echo "=============================================="
echo "✅ Setup completado exitosamente"
echo "=============================================="
echo ""
echo "📝 PRÓXIMOS PASOS:"
echo ""
echo "1. Activar el entorno virtual:"
echo "   source venv/bin/activate"
echo ""
echo "2. Iniciar el servidor:"
echo "   ./start.sh"
echo ""
echo "3. Desactivar el entorno (cuando termines):"
echo "   deactivate"
echo ""
echo "💡 NOTA: Este proyecto actualmente NO requiere venv"
echo "   Solo lo necesitarás si añades dependencias externas"
echo ""

