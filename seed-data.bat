@echo off
REM ============================================================
REM  OPTIONAL: load sample data into the database
REM  Run this AFTER the backend has been started at least once.
REM ============================================================
cd /d "%~dp0backend"

if not exist ".venv\" (
    echo Please run run-backend.bat first to set things up.
    pause
    exit /b 1
)

call .venv\Scripts\activate.bat
echo Loading sample data...
python seed.py
echo.
echo Done. Refresh the site to see the sample content.
pause
