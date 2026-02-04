@echo off
echo ========================================
echo   INSTALADOR GLICO - FRONTEND
echo ========================================
echo.

cd frontend

echo [1/2] Instalando dependencias...
call npm install react-router-dom axios recharts

echo.
echo [2/2] Criando arquivo .env.local...
if not exist .env.local (
    copy .env.example .env.local
    echo Arquivo .env.local criado!
) else (
    echo Arquivo .env.local ja existe.
)

echo.
echo ========================================
echo   INSTALACAO CONCLUIDA!
echo ========================================
echo.
echo PROXIMOS PASSOS:
echo 1. Execute run-dev.bat para iniciar o projeto
echo 2. Acesse http://localhost:5173 no navegador
echo.
pause
