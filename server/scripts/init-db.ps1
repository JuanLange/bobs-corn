# Script para inicializar la base de datos de Bob's Corn

Write-Host "Inicializando la base de datos de Bob's Corn..." -ForegroundColor Green

# Configurar variables de entorno para PostgreSQL
$env:PGUSER = "postgres"
$env:PGPASSWORD = "admin"

# Función para ejecutar comandos SQL
function Invoke-PostgreSQL {
    param (
        [string]$Command
    )
    $result = psql -c $Command 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error ejecutando comando SQL: $result" -ForegroundColor Red
        exit 1
    }
}

# Verificar si la base de datos existe
Write-Host "Verificando conexión a PostgreSQL..." -ForegroundColor Yellow
Invoke-PostgreSQL "SELECT 1;"

# Crear la base de datos y las tablas
Write-Host "Creando base de datos y tablas..." -ForegroundColor Yellow
$initScriptPath = Join-Path $PSScriptRoot "..\src\db\init.sql"
$result = psql -f $initScriptPath 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "¡Base de datos inicializada correctamente! 🌽" -ForegroundColor Green
} else {
    Write-Host "Error inicializando la base de datos: $result" -ForegroundColor Red
    exit 1
}

Write-Host "Proceso completado. La base de datos está lista para usar." -ForegroundColor Green
