@echo off
echo ========================================
echo   INSTALADOR GLICO - BACKEND
echo ========================================
echo.

cd backend

echo [1/3] Instalando dependencias de producao...
call npm install express cors dotenv helmet morgan @supabase/supabase-js resend

echo.
echo [2/3] Instalando dependencias de desenvolvimento...
call npm install --save-dev nodemon

echo.
echo [3/3] Criando arquivo .env...
if not exist .env (
    copy .env.example .env
    echo Arquivo .env criado! EDITE com suas credenciais.
) else (
    echo Arquivo .env ja existe.
)

echo.
echo ========================================
echo   INSTALACAO CONCLUIDA!
echo ========================================
echo.
echo PROXIMOS PASSOS:
echo 1. Edite o arquivo backend\.env com suas credenciais
echo 2. Execute o script install-frontend.bat
echo 3. Configure o banco de dados no Supabase
echo.
pause
