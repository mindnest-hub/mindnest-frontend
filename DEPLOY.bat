@echo off
echo ========================================
echo MindNest - Auto Deploy to Vercel
echo ========================================
echo.

REM Check for changes
echo Checking for changes...
git status

echo.
echo Step 1: Committing changes...
git add .
git commit -m "Auto-deploy: %date% %time%"

if %ERRORLEVEL% EQU 0 (
    echo ✓ Changes committed
) else (
    echo ℹ No changes to commit
)

echo.
echo Step 2: Pushing to GitHub...
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo ✓ Pushed to GitHub
    echo.
    echo ========================================
    echo SUCCESS!
    echo ========================================
    echo.
    echo If Vercel is connected to GitHub:
    echo   → Auto-deploy will start automatically
    echo   → Check: https://vercel.com/dashboard
    echo.
    echo If not connected:
    echo   → Run: npx vercel --prod
    echo.
) else (
    echo ✗ Push failed
)

pause
