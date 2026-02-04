@echo off
echo ========================================
echo   GLICO - Iniciando Servidores
echo ========================================
echo.

echo Abrindo Backend (porta 3000)...
start "Glico Backend" cmd /k "cd backend && npm run dev"

timeout /t 3

echo Abrindo Frontend (porta 5173)...
start "Glico Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   SERVIDORES INICIADOS!
echo ========================================
echo.
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo Pressione Ctrl+C em cada janela para parar os servidores.
echo.
pause
