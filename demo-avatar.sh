#!/bin/bash

# 🎭 TalkingHead Avatar Demo Script
# Script para probar la integración completa del avatar

echo "🎭 Iniciando demostración del TalkingHead Avatar..."
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "public/index.html" ]; then
    echo "❌ Error: Ejecuta este script desde el directorio raíz del proyecto"
    exit 1
fi

echo "✅ Directorio correcto encontrado"

# Verificar archivos del avatar
echo "🔍 Verificando archivos del avatar..."

required_files=(
    "public/js/talkinghead-avatar.js"
    "public/js/avatar-settings.js"
    "public/js/avatar-config.js"
    "public/css/talkinghead-avatar.css"
    "public/css/avatar-settings.css"
    "public/avatar/models/README.md"
    "TALKINGHEAD-INTEGRATION.md"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file - FALTANTE"
        exit 1
    fi
done

echo ""
echo "🎯 Verificando integración en index.html..."

# Verificar que los archivos están incluidos en index.html
if grep -q "talkinghead-avatar.css" public/index.html; then
    echo "  ✅ CSS del avatar incluido"
else
    echo "  ❌ CSS del avatar NO incluido"
fi

if grep -q "talkinghead-avatar.js" public/index.html; then
    echo "  ✅ JavaScript del avatar incluido"
else
    echo "  ❌ JavaScript del avatar NO incluido"
fi

if grep -q "avatar-container" public/index.html; then
    echo "  ✅ Contenedor del avatar presente"
else
    echo "  ❌ Contenedor del avatar NO presente"
fi

echo ""
echo "🚀 Iniciando servidor de desarrollo..."

# Verificar si Python está disponible
if command -v python3 &> /dev/null; then
    echo "🐍 Usando Python 3 para servidor HTTP"
    cd public
    echo "📡 Servidor iniciado en: http://localhost:8000"
    echo "🎭 Abre esa URL en tu navegador para ver el avatar en acción"
    echo ""
    echo "📋 Características a probar:"
    echo "  • Avatar visual (pecho hacia arriba)"
    echo "  • Animación idle automática"
    echo "  • Chat bubble interactivo (esquina inferior derecha)"
    echo "  • Botón de configuración (⚙️) en el avatar"
    echo "  • Panel de configuraciones avanzadas"
    echo "  • Responsive design en diferentes tamaños"
    echo ""
    echo "🛑 Presiona Ctrl+C para detener el servidor"
    echo ""
    
    python3 -m http.server 8000
    
elif command -v python &> /dev/null; then
    echo "🐍 Usando Python 2 para servidor HTTP"
    cd public
    echo "📡 Servidor iniciado en: http://localhost:8000"
    echo "🎭 Abre esa URL en tu navegador para ver el avatar en acción"
    python -m SimpleHTTPServer 8000
    
else
    echo "❌ Python no encontrado"
    echo "📝 Para probar manualmente:"
    echo "   1. Inicia un servidor web en la carpeta 'public'"
    echo "   2. Abre index.html en un navegador"
    echo "   3. Verifica que el avatar aparece y el chat funciona"
fi
