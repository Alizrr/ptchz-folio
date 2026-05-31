@echo off
REM ============================================================
REM  Run the backend (FastAPI) on Windows
REM  Double-click this file, or run it from a terminal.
REM ============================================================
cd /d "%~dp0backend"

echo.
echo === Academic Portfolio - Backend ===
echo.

REM Create virtual environment on first run
if not exist ".venv\" (
    echo [setup] Creating virtual environment...
    python -m venv .venv
    if errorlevel 1 (
        echo.
        echo ERROR: Could not create the virtual environment.
        echo Make sure Python is installed and added to PATH.
        pause
        exit /b 1
    )
)

REM Activate it
call .venv\Scripts\activate.bat

REM Install dependencies (quick if already installed)
echo [setup] Installing dependencies...
pip install -q -r requirements.txt

echo.
echo Backend running at http://localhost:8000
echo Admin credentials are read from backend\.env on first startup.
echo If ADMIN_PASSWORD is not set, the backend prints a temporary password.
echo Press Ctrl+C to stop.
echo.

uvicorn main:app --reload --port 8000
pause
