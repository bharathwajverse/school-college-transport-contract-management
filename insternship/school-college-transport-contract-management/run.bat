@echo off
title Transport Contract Management System Launcher
echo ============================================================
echo Transport Contract Management System Launcher
echo ============================================================
echo.

rem Check for Node.js installation
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js v18 or higher to run this project.
    pause
    exit /b 1
)

rem Check if dependencies are installed, install if missing
if not exist "backend\node_modules\" (
    echo [INFO] Backend dependencies not found. Installing...
    call npm install --prefix backend
)

if not exist "frontend\node_modules\" (
    echo [INFO] Frontend dependencies not found. Installing...
    call npm install --prefix frontend
)

echo.
echo [INFO] Launching Backend Development Server...
start "Backend Dev Server" cmd /c "npm run dev:backend"

echo [INFO] Launching Frontend Development Server...
start "Frontend Dev Server" cmd /c "npm run dev:frontend"

echo.
echo ============================================================
echo Both servers have been launched in separate terminal windows!
echo - Backend API: http://localhost:5000 (default)
echo - Frontend Application: http://localhost:5173 (Vite default)
echo.
echo Press any key to close this launcher. The servers will continue running.
echo ============================================================
echo.
pause >nul
