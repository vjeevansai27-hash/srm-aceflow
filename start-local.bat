@echo off
title AceFlow Local Server (http://localhost:3000)
cd /d "%~dp0"
echo ===================================================
echo   Starting AceFlow Local Dev Server on Port 3000
echo   URL: http://localhost:3000
echo ===================================================
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
