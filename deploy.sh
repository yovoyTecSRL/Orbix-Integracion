#!/bin/bash
# 🧠 Script de Despliegue - Orbix AI Platform

echo "🚀 Desplegando Orbix AI Platform..."

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Instalando..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    sudo usermod -aG docker $USER
    echo "✅ Docker instalado. Reinicia tu sesión para aplicar los cambios."
    exit 1
fi

# Verificar si Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado. Instalando..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Compose instalado."
fi

# Verificar que existe el archivo .env
if [ ! -f .env ]; then
    echo "⚠️ Archivo .env no encontrado. Copiando desde .env.example..."
    cp .env.example .env
    echo "📝 Por favor, edita el archivo .env con tus credenciales reales:"
    echo "   - OPENAI_API_KEY_ORBIX"
    echo "   - OPENAI_API_KEY_TEST"
    echo "   - ODOO_URL, ODOO_USER, ODOO_PASS"
    echo "   - MIMOTO_API_KEY"
    echo ""
    read -p "¿Has configurado el archivo .env? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Configura el archivo .env antes de continuar."
        exit 1
    fi
fi

# Crear directorio de logs si no existe
mkdir -p logs

echo "🔨 Construyendo imagen Docker..."
docker-compose build

echo "🚀 Iniciando servicios..."
docker-compose up -d

echo "⏳ Esperando que el servicio esté listo..."
sleep 10

# Verificar salud del servicio
echo "🔍 Verificando salud del servicio..."
if curl -f http://localhost:8000/health &> /dev/null; then
    echo "✅ ¡Orbix AI Platform está funcionando!"
    echo ""
    echo "🌐 Acceso a la aplicación:"
    echo "   • API Docs: http://localhost:8000/docs"
    echo "   • Health Check: http://localhost:8000/health"
    echo "   • Nginx (si está habilitado): http://localhost"
    echo ""
    echo "📊 Ver logs en tiempo real:"
    echo "   docker-compose logs -f orbix-ai"
    echo ""
    echo "🛑 Detener servicios:"
    echo "   docker-compose down"
else
    echo "❌ El servicio no está respondiendo. Verificando logs..."
    docker-compose logs orbix-ai
    echo ""
    echo "💡 Comandos útiles para debug:"
    echo "   docker-compose logs orbix-ai"
    echo "   docker-compose exec orbix-ai bash"
    echo "   docker-compose restart orbix-ai"
fi
