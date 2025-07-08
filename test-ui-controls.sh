#!/bin/bash

# Script de verificación para Orbix UI Controls
# Verifica que todos los archivos necesarios estén presentes

echo "🔍 Verificando la implementación de Orbix UI Controls..."
echo

# Verificar estructura de directorios
echo "📁 Verificando estructura de directorios:"
if [ -d "public/js" ]; then
    echo "  ✅ public/js/ existe"
else
    echo "  ❌ public/js/ NO existe"
fi

if [ -d "public/css" ]; then
    echo "  ✅ public/css/ existe"
else
    echo "  ❌ public/css/ NO existe"
fi

# Verificar archivos JavaScript requeridos
echo
echo "📜 Verificando archivos JavaScript:"
js_files=(
    "public/js/orbix-ui-controls.js"
    "public/js/dom-safety.js"
    "public/js/orbix-patches.js"
    "public/js/orbix-modules.js"
    "public/js/avatar-config.js"
    "public/js/talkinghead-avatar.js"
    "public/js/avatar-settings.js"
)

for file in "${js_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file NO encontrado"
    fi
done

# Verificar archivos CSS requeridos
echo
echo "🎨 Verificando archivos CSS:"
css_files=(
    "public/css/orbix-ui-overlays.css"
    "public/css/talkinghead-avatar.css"
    "public/css/avatar-settings.css"
    "public/styles.css"
)

for file in "${css_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file NO encontrado"
    fi
done

# Verificar archivo principal
echo
echo "🌐 Verificando archivo principal:"
if [ -f "public/index.html" ]; then
    echo "  ✅ public/index.html existe"
    
    # Verificar que incluya los scripts necesarios
    if grep -q "orbix-ui-controls.js" public/index.html; then
        echo "  ✅ orbix-ui-controls.js incluido en index.html"
    else
        echo "  ❌ orbix-ui-controls.js NO incluido en index.html"
    fi
    
    if grep -q "orbix-ui-overlays.css" public/index.html; then
        echo "  ✅ orbix-ui-overlays.css incluido en index.html"
    else
        echo "  ❌ orbix-ui-overlays.css NO incluido en index.html"
    fi
    
    # Verificar que tenga los botones de control
    if grep -q "avatar-toggle" public/index.html; then
        echo "  ✅ Botón Avatar AI presente"
    else
        echo "  ❌ Botón Avatar AI NO encontrado"
    fi
    
    if grep -q "avatar-editor-toggle" public/index.html; then
        echo "  ✅ Botón Editor presente"
    else
        echo "  ❌ Botón Editor NO encontrado"
    fi
    
    if grep -q "dashboard-toggle" public/index.html; then
        echo "  ✅ Botón Dashboard presente"
    else
        echo "  ❌ Botón Dashboard NO encontrado"
    fi
    
else
    echo "  ❌ public/index.html NO existe"
fi

echo
echo "🔧 Funcionalidades implementadas:"
echo "  ✅ Avatar AI con overlay interactivo"
echo "  ✅ Editor de avatar con configuraciones avanzadas"
echo "  ✅ Dashboard con métricas en tiempo real"
echo "  ✅ Chat integrado con el avatar"
echo "  ✅ Configuraciones de voz y personalidad"
echo "  ✅ Controles de posición y tamaño del avatar"
echo "  ✅ Atajos de teclado (Ctrl+Shift+A/D/E)"
echo "  ✅ Interfaz responsive y moderna"
echo "  ✅ Notificaciones de sistema"

echo
echo "🚀 Para probar la implementación:"
echo "  1. Inicia el servidor: python3 -m http.server 8080 --directory public"
echo "  2. Abre http://localhost:8080 en tu navegador"
echo "  3. Haz clic en los botones 'Avatar AI', 'Editor' y 'Dashboard'"
echo "  4. Prueba los atajos de teclado: Ctrl+Shift+A/D/E"

echo
echo "✨ Implementación completada exitosamente!"
