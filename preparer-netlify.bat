@echo off
chcp 65001 >nul
title Activ Aidance - preparation du zip pour Netlify
cd /d "%~dp0"

if not exist node_modules (
  echo Installation des dependances, une seule fois...
  call npm install --no-audit --no-fund
)

echo Construction du site...
call npm run build
if errorlevel 1 (
  echo.
  echo ERREUR : la construction du site a echoue.
  pause
  exit /b 1
)

if exist activ-aidance-netlify.zip del activ-aidance-netlify.zip
tar -a -c -f activ-aidance-netlify.zip -C _site .
if errorlevel 1 (
  echo.
  echo ERREUR : la creation du zip a echoue.
  pause
  exit /b 1
)

echo.
echo Termine. Fichier cree : %~dp0activ-aidance-netlify.zip
echo Glissez-le sur https://app.netlify.com/drop
echo.
pause
