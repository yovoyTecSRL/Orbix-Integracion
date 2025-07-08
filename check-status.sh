#!/bin/bash

# Script de verificación del estado de Orbix AI Systems
# Autor: Orbix Development Team
# Fecha: 2024

echo "🚀 ORBIX AI SYSTEMS - STATUS CHECK"
echo "=================================="
echo ""

echo "📊 PUERTOS Y SERVICIOS:"
echo "------------------------"

# Verificar puertos activos
echo "🔍 Verificando puertos en uso..."
PORTS=("80" "443" "3000" "6379" "8000")
for port in "${PORTS[@]}"; do
    if netstat -tlnp 2>/dev/null | grep -q ":$port "; then
        case $port in
            80)   echo "✅ Puerto $port: Nginx (HTTP)" ;;
            443)  echo "✅ Puerto $port: Nginx (HTTPS)" ;;
            3000) echo "✅ Puerto $port: Avatar TalkingHead (Node.js)" ;;
            6379) echo "✅ Puerto $port: Redis Cache" ;;
            8000) echo "✅ Puerto $port: FastAPI Python Backend" ;;
        esac
    else
        case $port in
            80)   echo "❌ Puerto $port: Nginx (HTTP) - NO ACTIVO" ;;
            443)  echo "❌ Puerto $port: Nginx (HTTPS) - NO ACTIVO" ;;
            3000) echo "❌ Puerto $port: Avatar TalkingHead - NO ACTIVO" ;;
            6379) echo "❌ Puerto $port: Redis Cache - NO ACTIVO" ;;
            8000) echo "❌ Puerto $port: FastAPI Backend - NO ACTIVO" ;;
        esac
    fi
done

echo ""
echo "🐳 CONTENEDORES DOCKER:"
echo "-----------------------"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(orbix|redis|nginx)" || echo "❌ No se encontraron contenedores de Orbix"

echo ""
echo "🌐 CONECTIVIDAD:"
echo "----------------"

# Test FastAPI
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ FastAPI Backend (8000): RESPONDIENDO"
else
    echo "❌ FastAPI Backend (8000): NO RESPONDE"
fi

# Test Avatar Server
if curl -s http://localhost:3000/ > /dev/null 2>&1; then
    echo "✅ Avatar Server (3000): RESPONDIENDO"
else
    echo "❌ Avatar Server (3000): NO RESPONDE"
fi

# Test Nginx
if curl -s http://localhost:80/ > /dev/null 2>&1; then
    echo "✅ Nginx Web Server (80): RESPONDIENDO"
else
    echo "❌ Nginx Web Server (80): NO RESPONDE"
fi

echo ""
echo "📁 ARCHIVOS PRINCIPALES:"
echo "------------------------"
FILES=("index.html" "styles.css" "js/avatar-manager.js" "js/main.js" "public/avatar/server.js")
for file in "${FILES[@]}"; do
    if [ -f "/workspaces/Orbix-Integracion/$file" ]; then
        echo "✅ $file: EXISTE"
    else
        echo "❌ $file: NO ENCONTRADO"
    fi
done

echo ""
echo "🔗 URLS DISPONIBLES:"
echo "-------------------"
echo "📱 Aplicación Principal: http://localhost:80"
echo "🤖 Avatar TalkingHead: http://localhost:3000"
echo "⚡ API Backend: http://localhost:8000"
echo "📊 Health Check: http://localhost:8000/health"
echo "🧮 Calculadora: http://localhost:80/calculadora.html"
echo "✅ Validaciones: http://localhost:80/validaciones.html"
echo "🔍 Diagnóstico: http://localhost:80/diagnostico.html"
echo "🛡️ Sentinel: http://localhost:80/sentinel.html"

echo ""
echo "=========================="
echo "✨ ORBIX AI SYSTEMS READY"
echo "=========================="
