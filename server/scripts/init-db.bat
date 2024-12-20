@echo off
echo Inicializando la base de datos de Bob's Corn...

rem Configurar variables de entorno para PostgreSQL
set PGUSER=postgres
set PGPASSWORD=admin

rem Verificar la conexión a PostgreSQL
echo Verificando conexion a PostgreSQL...
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -c "SELECT 1;" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: No se pudo conectar a PostgreSQL
    echo Asegurate de que PostgreSQL este instalado y ejecutandose
    exit /b 1
)

rem Crear la base de datos
echo Creando base de datos...
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -f "%~dp0..\src\db\create-db.sql"
if %ERRORLEVEL% NEQ 0 (
    echo Error creando la base de datos
    exit /b 1
)

rem Crear las tablas y funciones
echo Creando tablas y funciones...
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -d bobs_corn -f "%~dp0..\src\db\create-tables.sql"
if %ERRORLEVEL% NEQ 0 (
    echo Error creando las tablas
    exit /b 1
)

echo Base de datos inicializada correctamente! 🌽
echo Proceso completado. La base de datos esta lista para usar.
exit /b 0
