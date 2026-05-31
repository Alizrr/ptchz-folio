@echo off
REM ============================================================
REM  Run the frontend (React + Vite) on Windows
REM  Double-click this file, or run it from a terminal.
REM ============================================================
cd /d "%~dp0frontend"

echo.
echo === Academic Portfolio - Frontend ===
echo.

REM Install node modules on first run
if not exist "node_modules\" (
    echo [setup] Installing npm packages... this may take a minute.
    call npm install
    if errorlevel 1 (
        echo.
        echo ERROR: npm install failed. Make sure Node.js is installed.
        pause
        exit /b 1
    )
)

echo.
echo Frontend running at http://localhost:5173
echo Public site:  http://localhost:5173/
echo Admin panel:  http://localhost:5173/admin
echo Press Ctrl+C to stop.
echo.

call npm run dev
pause
