# ===================================================================
# ORBIX - Script de Deployment para Validación Financiera
# Autor: ORBIX Workspace
# Fecha: 2025-07-04
# Descripción: Despliega la aplicación de validación financiera al servidor
# ===================================================================

param(
    [switch]$Deploy = $false,
    [switch]$BackupFirst = $true
)

# Configuración
$PROJECT_PATH = "D:\ORBIX\proyectos\validacion-financiera"
$SERVER_HOST = "sistemasorbix.com"
$SERVER_USER = "root"
$SERVER_PATH = "/opt/validacion-financiera"
$BACKUP_PATH = "/opt/backups/validacion-financiera-$(Get-Date -Format 'yyyyMMdd-HHmmss')"

Write-Host "🚀 ORBIX - Deployment Validación Financiera" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

# Verificar que el proyecto existe localmente
if (-not (Test-Path $PROJECT_PATH)) {
    Write-Host "❌ Error: No se encuentra el proyecto en $PROJECT_PATH" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Proyecto encontrado en: $PROJECT_PATH" -ForegroundColor Green

# Verificar conectividad al servidor
Write-Host "`n🔍 Verificando conectividad al servidor..." -ForegroundColor Yellow
$connection = Test-NetConnection -ComputerName $SERVER_HOST -Port 22 -WarningAction SilentlyContinue
if (-not $connection.TcpTestSucceeded) {
    Write-Host "❌ Error: No se puede conectar al servidor $SERVER_HOST" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Conexión al servidor exitosa" -ForegroundColor Green

# Mostrar información del proyecto local
Write-Host "`n📊 Información del proyecto:" -ForegroundColor Cyan
Write-Host "   📁 Ruta local: $PROJECT_PATH"
Write-Host "   🌐 Servidor: $SERVER_HOST"
Write-Host "   📂 Ruta servidor: $SERVER_PATH"

# Listar archivos del proyecto
Write-Host "`n📋 Archivos a sincronizar:" -ForegroundColor Yellow
Get-ChildItem -Path $PROJECT_PATH -Exclude "venv", "__pycache__", "*.pyc", ".git" | ForEach-Object {
    Write-Host "   📄 $($_.Name)" -ForegroundColor Gray
}

if ($Deploy) {
    Write-Host "`n🚀 Iniciando deployment..." -ForegroundColor Magenta
    
    # Comando de sincronización con rsync (requiere WSL o rsync para Windows)
    $rsyncCommand = "rsync -avz --delete --exclude 'venv/' --exclude '__pycache__/' --exclude '*.pyc' '$PROJECT_PATH/' '$SERVER_USER@$SERVER_HOST:$SERVER_PATH/'"
    
    Write-Host "📤 Comando de sincronización:" -ForegroundColor Cyan
    Write-Host "   $rsyncCommand" -ForegroundColor Gray
    
    Write-Host "`n⚠️  Para completar el deployment, ejecuta estos comandos:" -ForegroundColor Yellow
    Write-Host "1. En PowerShell (con WSL instalado):" -ForegroundColor White
    Write-Host "   wsl $rsyncCommand" -ForegroundColor Gray
    
    Write-Host "`n2. O usando SCP:" -ForegroundColor White
    Write-Host "   scp -r '$PROJECT_PATH' '$SERVER_USER@$SERVER_HOST:$SERVER_PATH'" -ForegroundColor Gray
    
    Write-Host "`n3. En el servidor, ejecutar:" -ForegroundColor White
    Write-Host "   ssh $SERVER_USER@$SERVER_HOST" -ForegroundColor Gray
    Write-Host "   cd $SERVER_PATH" -ForegroundColor Gray
    Write-Host "   python3 -m venv venv" -ForegroundColor Gray
    Write-Host "   source venv/bin/activate" -ForegroundColor Gray
    Write-Host "   pip install -r requirements.txt" -ForegroundColor Gray
    Write-Host "   uvicorn main:app --host 0.0.0.0 --port 8001" -ForegroundColor Gray
    
}
else {
    Write-Host "`n💡 Para desplegar, ejecuta:" -ForegroundColor Yellow
    Write-Host "   .\deploy_validacion_financiera.ps1 -Deploy" -ForegroundColor White
}

# Información de la aplicación local
Write-Host "`n📍 Estado de la aplicación local:" -ForegroundColor Cyan
$process = Get-Process | Where-Object { $_.ProcessName -eq "uvicorn" }
if ($process) {
    Write-Host "   ✅ Aplicación ejecutándose localmente (PID: $($process.Id))" -ForegroundColor Green
    Write-Host "   🌐 URL local: http://localhost:8001" -ForegroundColor Cyan
    Write-Host "   📄 Frontend: file:///D:/ORBIX/proyectos/validacion-financiera/index.html" -ForegroundColor Cyan
}
else {
    Write-Host "   ⚠️  Aplicación no está ejecutándose localmente" -ForegroundColor Yellow
}

Write-Host "`n✨ Deployment script completado" -ForegroundColor Green
Write-Host "🔗 URLs útiles:" -ForegroundColor Cyan
Write-Host "   Local API: http://localhost:8001" -ForegroundColor White
Write-Host "   Local Frontend: file:///D:/ORBIX/proyectos/validacion-financiera/index.html" -ForegroundColor White
Write-Host "   Server (futuro): http://sistemasorbix.com:8001" -ForegroundColor White
