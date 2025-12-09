@echo off
echo ========================================
echo MindNest Frontend - Git Push Helper
echo ========================================
echo.

REM Check if repository exists
echo Step 1: Creating GitHub repository (if needed)...
echo Please create a new repository on GitHub:
echo   1. Go to https://github.com/new
echo   2. Repository name: mindnest-frontend
echo   3. Make it Public or Private
echo   4. DO NOT initialize with README
echo   5. Click "Create repository"
echo.
pause

REM Push to GitHub
echo.
echo Step 2: Pushing code to GitHub...
git push -u origin main --force

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! Code pushed to GitHub
    echo ========================================
    echo.
    echo Vercel will automatically deploy your changes!
    echo Check deployment status at: https://vercel.com/dashboard
    echo.
) else (
    echo.
    echo ========================================
    echo PUSH FAILED
    echo ========================================
    echo.
    echo Make sure you created the GitHub repository first.
    echo Repository URL should be: https://github.com/mindnest-hub/mindnest-frontend
    echo.
)

pause
