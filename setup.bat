@echo off
echo.
echo ========================================
echo  Master Test Generator - Quick Setup
echo ========================================
echo.

node scripts/setup.js

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Setup failed. Please check the errors above.
    pause
    exit /b %ERRORLEVEL%
)

echo.
pause


