@echo off
REM Avvia il sito di Crazy. in locale (serve Node.js 22 o piu recente: https://nodejs.org)
cd /d "%~dp0"
where node >/dev/null 2>/dev/null || (echo Node.js non trovato. Installalo da https://nodejs.org e riprova. & pause & exit /b 1)
if not exist node_modules (echo Installo i pacchetti, solo la prima volta... & call npm install)
echo Apro il sito su http://localhost:4321/it/
start "" http://localhost:4321/it/
call npm run dev
pause
