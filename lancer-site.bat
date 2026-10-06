@echo off
chcp 65001 >nul
title Activ Aidance - serveur de test
cd /d "%~dp0"

if not exist node_modules (
  echo Installation des dependances, une seule fois...
  call npm install --no-audit --no-fund
)

echo.
echo Le site va s'ouvrir sur http://localhost:8090
echo Fermez cette fenetre ou appuyez sur Ctrl+C pour arreter le site.
echo.

start "" cmd /c "timeout /t 4 /nobreak >nul & start http://localhost:8090"
call npm start
pause
