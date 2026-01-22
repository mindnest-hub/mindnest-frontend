@echo off
echo Starting African Edu App Development Server...
echo This script bypasses PowerShell execution policy issues.
echo Access the app at http://localhost:5173

cd /d "%~dp0"
cmd /c "npm run dev"
pause
