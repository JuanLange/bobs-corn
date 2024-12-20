@echo off
echo Configurando Bob's Corn...

rem Instalar dependencias del frontend
echo Instalando dependencias del frontend...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error instalando dependencias del frontend
    exit /b 1
)

rem Instalar dependencias del backend
echo Instalando dependencias del backend...
cd server
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error instalando dependencias del backend
    cd ..
    exit /b 1
)

rem Inicializar la base de datos
echo Inicializando la base de datos...
call scripts/init-db.bat
if %ERRORLEVEL% NEQ 0 (
    echo Error inicializando la base de datos
    cd ..
    exit /b 1
)

cd ..

rem Crear archivo .env del backend si no existe
if not exist "server\.env" (
    echo Creando archivo .env del backend...
    copy server\.env.example server\.env
)

echo.
echo ¡Instalación completada! 🌽
echo.
echo Para iniciar la aplicación:
echo 1. En una terminal: cd server ^& npm run dev
echo 2. En otra terminal: npm run dev
echo.
echo ¡Disfruta vendiendo maíz! 🌽

exit /b 0
