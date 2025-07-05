@echo off
echo 🚀 ORBIX - Push directo a GitHub
cd /d "D:\ORBIX\proyectos\validacion-financiera"

echo 🔄 Configurando Git para evitar editor...
git config core.editor "echo"
git config --global core.editor "echo"

echo 🔄 Reseteando estado...
git merge --abort 2>nul
git reset --hard HEAD 2>nul

echo 📤 Forzando push a GitHub...
git push -f origin main

echo ✅ Push completado
pause
