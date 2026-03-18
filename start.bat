@echo off
cd /d "%~dp0backend"
start cmd /k "node server.js"
echo Backend started on http://localhost:3000
pause