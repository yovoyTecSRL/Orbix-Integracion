# ===================================================================
# ORBIX - Script de Git Push para Validación Financiera
# Autor: ORBIX Workspace
# Fecha: 2025-07-04
# Descripción: Maneja el push del proyecto validacion-financiera a GitHub
# ===================================================================

param(
    [switch]$Force = $false,
    [switch]$Verbose = $false
)

# Colores para mejor visualización
$ColorSuccess = "Green"
$ColorWarning = "Yellow" 
$ColorError = "Red"
$ColorInfo = "Cyan"
$ColorHeader = "Magenta"

function Write-OrbixHeader {
    Write-Host ""
    Write-Host "🚀 ORBIX - Git Push Validación Financiera" -ForegroundColor $ColorHeader
    Write-Host "=" * 60 -ForegroundColor $ColorHeader
    Write-Host "📍 Repositorio: git@github.com:yovoyTecSRL/Orbix-Integracion.git" -ForegroundColor $ColorInfo
    Write-Host "🌿 Rama: main" -ForegroundColor $ColorInfo
    Write-Host "📅 Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor $ColorInfo
    Write-Host "=" * 60 -ForegroundColor $ColorHeader
    Write-Host ""
}

function Test-GitRepository {
    Write-Host "🔍 Verificando repositorio Git..." -ForegroundColor $ColorInfo
    
    if (-not (Test-Path ".git")) {
        Write-Host "❌ ERROR: No se encontró repositorio Git" -ForegroundColor $ColorError
        return $false
    }
    
    Write-Host "✅ Repositorio Git encontrado" -ForegroundColor $ColorSuccess
    return $true
}

function Reset-GitMerge {
    Write-Host "🔄 Reseteando merge en proceso..." -ForegroundColor $ColorInfo
    
    try {
        # Cancelar cualquier merge en proceso
        git merge --abort 2>$null
        git reset --hard HEAD 2>$null
        Write-Host "✅ Merge reseteado" -ForegroundColor $ColorSuccess
    }
    catch {
        Write-Host "⚠️  No hay merge en proceso" -ForegroundColor $ColorWarning
    }
}

function Sync-WithRemote {
    Write-Host "🔄 Sincronizando con repositorio remoto..." -ForegroundColor $ColorInfo
    
    try {
        # Configurar editor simple para evitar problemas con vim
        git config core.editor "echo"
        
        # Hacer fetch para obtener información del remoto
        git fetch origin main
        
        # Verificar si hay diferencias
        $localCommit = git rev-parse HEAD
        $remoteCommit = git rev-parse origin/main
        
        if ($localCommit -eq $remoteCommit) {
            Write-Host "✅ Local y remoto están sincronizados" -ForegroundColor $ColorSuccess
            return $true
        }
        
        Write-Host "⚠️  Diferencias detectadas entre local y remoto" -ForegroundColor $ColorWarning
        
        if ($Force) {
            Write-Host "🔧 Forzando push..." -ForegroundColor $ColorWarning
            git push -f origin main
        } else {
            Write-Host "🔄 Haciendo pull con merge automático..." -ForegroundColor $ColorInfo
            git pull origin main --no-edit --allow-unrelated-histories
        }
        
        return $true
    }
    catch {
        Write-Host "❌ Error sincronizando: $($_.Exception.Message)" -ForegroundColor $ColorError
        return $false
    }
}

function Push-ToGitHub {
    Write-Host "📤 Enviando código a GitHub..." -ForegroundColor $ColorInfo
    
    try {
        # Verificar estado del repositorio
        $status = git status --porcelain
        if ($status) {
            Write-Host "⚠️  Hay cambios sin commitear:" -ForegroundColor $ColorWarning
            git status --short
            return $false
        }
        
        # Hacer push
        git push -u origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Push completado exitosamente" -ForegroundColor $ColorSuccess
            return $true
        } else {
            Write-Host "❌ Error en el push" -ForegroundColor $ColorError
            return $false
        }
    }
    catch {
        Write-Host "❌ Error haciendo push: $($_.Exception.Message)" -ForegroundColor $ColorError
        return $false
    }
}

function Show-GitSummary {
    Write-Host ""
    Write-Host "📊 RESUMEN DEL REPOSITORIO" -ForegroundColor $ColorHeader
    Write-Host "=" * 40 -ForegroundColor $ColorHeader
    
    try {
        Write-Host "🌿 Rama actual:" -ForegroundColor $ColorInfo
        git branch --show-current
        
        Write-Host ""
        Write-Host "📝 Último commit:" -ForegroundColor $ColorInfo
        git log --oneline -1
        
        Write-Host ""
        Write-Host "🔗 Remote configurado:" -ForegroundColor $ColorInfo
        git remote -v
        
        Write-Host ""
        Write-Host "📊 Estado:" -ForegroundColor $ColorInfo
        git status --short
        
    }
    catch {
        Write-Host "❌ Error obteniendo información del repositorio" -ForegroundColor $ColorError
    }
    
    Write-Host ""
    Write-Host "=" * 40 -ForegroundColor $ColorHeader
    Write-Host "✨ Operación completada" -ForegroundColor $ColorSuccess
    Write-Host ""
}

# ===================================================================
# EJECUCIÓN PRINCIPAL
# ===================================================================

Write-OrbixHeader

# Verificar que estamos en un repositorio Git
if (-not (Test-GitRepository)) {
    exit 1
}

# Resetear cualquier merge en proceso
Reset-GitMerge

# Sincronizar con remoto
if (-not (Sync-WithRemote)) {
    Write-Host "❌ Error en la sincronización" -ForegroundColor $ColorError
    exit 1
}

# Hacer push
if (-not (Push-ToGitHub)) {
    Write-Host "❌ Error en el push" -ForegroundColor $ColorError
    exit 1
}

# Mostrar resumen
Show-GitSummary

Write-Host "🎉 ¡Proyecto subido exitosamente a GitHub!" -ForegroundColor $ColorSuccess
Write-Host "🔗 Repositorio: https://github.com/yovoyTecSRL/Orbix-Integracion" -ForegroundColor $ColorInfo
