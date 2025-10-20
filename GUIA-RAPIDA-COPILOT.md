# ⚡ Guía Rápida: Activar GitHub Copilot Pro en VS Code

## 🎯 Solución Rápida (5 minutos)

### Paso 1: Verificar Plan
Ve a https://github.com/settings/copilot y confirma que tienes **Copilot Pro activo**

### Paso 2: Refrescar Sesión
```bash
1. En VS Code: Haz clic en tu foto de perfil (abajo-izquierda)
2. Selecciona "Sign out"
3. Cierra VS Code completamente
4. Abre VS Code de nuevo
5. Inicia sesión con GitHub
```

### Paso 3: Verificar Estado
```bash
Ctrl+Shift+P (o Cmd+Shift+P en Mac)
→ Escribe: "GitHub Copilot: Check Status"
→ Debe decir "Copilot Pro"
```

## 🚨 Si No Funciona

### Opción A: Limpiar Caché (Windows)
```powershell
Remove-Item -Recurse -Force "$env:USERPROFILE\.vscode\extensions\github.copilot-*"
Remove-Item -Recurse -Force "$env:APPDATA\Code\User\globalStorage\github.copilot"
```

### Opción B: Limpiar Caché (Mac/Linux)
```bash
rm -rf ~/.vscode/extensions/github.copilot-*
rm -rf ~/.config/Code/User/globalStorage/github.copilot
```

Después de limpiar la caché:
1. Reinicia VS Code
2. Reinstala la extensión "GitHub Copilot"
3. Inicia sesión de nuevo

## 🔗 Documentación Completa
Ver [COPILOT-PRO-VSCODE.md](./COPILOT-PRO-VSCODE.md) para guía detallada con más soluciones.

## ✅ Prueba Final
Escribe esto en un archivo `.js`:
```javascript
// función que calcula el factorial de un número
```
Copilot debe sugerir automáticamente el código. ¡Listo! 🎉
