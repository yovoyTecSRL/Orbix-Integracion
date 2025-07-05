# ===================================================================
# ORBIX - Script de Git Push para Validación Financiera
# Autor: ORBIX Workspace
# Fecha: 2025-07-04
# Descripción: Sube el proyecto validacion-financiera a GitHub
# ===================================================================

param(
    [switch]$Force = $false
)

# Configuración
$PROJECT_PATH = "D:\ORBIX\proyectos\validacion-financiera"
$REPO_URL = "git@github.com:yovoyTecSRL/Orbix-Integracion.git"
$BRANCH = "main"
$COMMIT_MESSAGE = "🚀 Primer commit - Subida de validación financiera completa"

Write-Host "🚀 ORBIX - Git Push para Validación Financiera" -ForegroundColor Cyan
Write-Host "=" * 55 -ForegroundColor Cyan
Write-Host "📂 Proyecto: $PROJECT_PATH" -ForegroundColor White
Write-Host "🔗 Repositorio: $REPO_URL" -ForegroundColor White
Write-Host "🌿 Rama: $BRANCH" -ForegroundColor White
Write-Host "💬 Commit: $COMMIT_MESSAGE" -ForegroundColor White
Write-Host "=" * 55 -ForegroundColor Cyan

# Verificar que el proyecto existe
if (-not (Test-Path $PROJECT_PATH)) {
    Write-Host "❌ Error: No se encuentra el proyecto en $PROJECT_PATH" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Proyecto encontrado" -ForegroundColor Green

# Cambiar al directorio del proyecto
Set-Location $PROJECT_PATH
Write-Host "📁 Cambiado al directorio: $(Get-Location)" -ForegroundColor Cyan

# Verificar si Git está instalado
try {
    $gitVersion = git --version
    Write-Host "✅ Git disponible: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Git no está instalado o no está en PATH" -ForegroundColor Red
    exit 1
}

# Crear .gitignore
Write-Host "`n📝 Creando .gitignore..." -ForegroundColor Yellow
$gitignoreContent = @"
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
pip-wheel-metadata/
share/python-wheels/
*.egg-info/
.installed.cfg
*.egg
MANIFEST

# Virtual Environment
venv/
env/
ENV/
env.bak/
venv.bak/

# VS Code
.vscode/
*.code-workspace

# IDEs
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
logs/
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Grunt intermediate storage
.grunt

# Bower dependency directory
bower_components

# node_modules
node_modules/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.test

# parcel-bundler cache
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# ORBIX specific
backups/
*.backup
"@

$gitignoreContent | Out-File -FilePath ".gitignore" -Encoding UTF8 -Force
Write-Host "✅ .gitignore creado" -ForegroundColor Green

# Inicializar repositorio Git si no existe
if (-not (Test-Path ".git")) {
    Write-Host "`n🔧 Inicializando repositorio Git..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Repositorio Git inicializado" -ForegroundColor Green
} else {
    Write-Host "`n✅ Repositorio Git ya existe" -ForegroundColor Green
}

# Configurar remote origin
Write-Host "`n🔗 Configurando remote origin..." -ForegroundColor Yellow
try {
    # Remover origin existente si existe
    git remote remove origin 2>$null
} catch {
    # Ignorar error si no existe
}

git remote add origin $REPO_URL
Write-Host "✅ Remote origin configurado: $REPO_URL" -ForegroundColor Green

# Verificar conexión SSH (opcional)
Write-Host "`n🔑 Verificando conexión SSH..." -ForegroundColor Yellow
try {
    $sshTest = ssh -T git@github.com 2>&1
    if ($sshTest -like "*successfully authenticated*") {
        Write-Host "✅ Conexión SSH a GitHub exitosa" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Advertencia: Verifica tu configuración SSH con GitHub" -ForegroundColor Yellow
        Write-Host "   $sshTest" -ForegroundColor Gray
    }
} catch {
    Write-Host "⚠️  No se pudo verificar SSH, continuando..." -ForegroundColor Yellow
}

# Mostrar archivos que se van a agregar
Write-Host "`n📋 Archivos a agregar al repositorio:" -ForegroundColor Cyan
$filesToAdd = git ls-files --others --exclude-standard
if ($filesToAdd) {
    $filesToAdd | ForEach-Object {
        Write-Host "   📄 $_" -ForegroundColor Gray
    }
} else {
    Write-Host "   (Verificando archivos...)" -ForegroundColor Gray
}

# Agregar todos los archivos (respetando .gitignore)
Write-Host "`n📦 Agregando archivos al staging..." -ForegroundColor Yellow
git add .
Write-Host "✅ Archivos agregados" -ForegroundColor Green

# Mostrar status
Write-Host "`n📊 Estado del repositorio:" -ForegroundColor Cyan
git status --porcelain | ForEach-Object {
    Write-Host "   $_" -ForegroundColor Gray
}

# Hacer commit
Write-Host "`n💾 Creando commit..." -ForegroundColor Yellow
try {
    git commit -m $COMMIT_MESSAGE
    Write-Host "✅ Commit creado exitosamente" -ForegroundColor Green
} catch {
    Write-Host "❌ Error al crear commit: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Configurar upstream y push
Write-Host "`n🚀 Subiendo a GitHub..." -ForegroundColor Magenta
try {
    if ($Force) {
        git push -u origin $BRANCH --force
        Write-Host "✅ Push forzado completado" -ForegroundColor Green
    } else {
        git push -u origin $BRANCH
        Write-Host "✅ Push completado exitosamente" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Error en push: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Soluciones posibles:" -ForegroundColor Yellow
    Write-Host "   1. Verificar conexión SSH: ssh -T git@github.com" -ForegroundColor White
    Write-Host "   2. Verificar permisos del repositorio" -ForegroundColor White
    Write-Host "   3. Si hay conflictos, usar: .\git_push_validacion.ps1 -Force" -ForegroundColor White
    exit 1
}

# Resumen final
Write-Host "`n🎉 PUSH COMPLETADO EXITOSAMENTE" -ForegroundColor Green
Write-Host "=" * 40 -ForegroundColor Green
Write-Host "📍 Repositorio: $REPO_URL" -ForegroundColor White
Write-Host "🌿 Rama: $BRANCH" -ForegroundColor White
Write-Host "💬 Commit: $COMMIT_MESSAGE" -ForegroundColor White
Write-Host "🔗 URL: https://github.com/yovoyTecSRL/Orbix-Integracion" -ForegroundColor Cyan
Write-Host "=" * 40 -ForegroundColor Green

Write-Host "`n💡 Próximos pasos:" -ForegroundColor Yellow
Write-Host "   1. Verificar el repositorio en GitHub" -ForegroundColor White
Write-Host "   2. Configurar GitHub Actions si es necesario" -ForegroundColor White
Write-Host "   3. Actualizar README.md con instrucciones" -ForegroundColor White

Write-Host "`n✨ Proceso completado" -ForegroundColor Cyan
