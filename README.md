# Bob's Corn Farm 🌽

Una aplicación fullstack para prueba tecnica.

## Características

- Límite de 1 maíz por cliente por minuto
- Identificación de clientes por IP
- Interfaz de usuario intuitiva con React y Shadcn
- Historial de compras en tiempo real con gráficos
- Sistema de notificaciones para el usuario
- Panel deslizante con estadísticas de compra
- Gráfico de barras para visualizar compras diarias

## Tecnologías

- **Frontend**: 
  - React + TypeScript + Vite
  - TailwindCSS + Shadcn/ui para componentes
  - Framer Motion para animaciones
  - Recharts para gráficos Cartesianos
  - date-fns para manejo de fechas
- **Backend**: 
  - Node.js + Express + TypeScript
  - Prisma como ORM
  - Rate limiting personalizado
- **Base de datos**: PostgreSQL
- **Testing**: Jest + Testing Library

## Requisitos Previos

- Node.js (v18 o superior)
- PostgreSQL (v14 o superior)
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone [url-del-repositorio]
cd baselabs
```

2. Instalar dependencias:
```bash
# Instalar dependencias del frontend
npm install

# Instalar dependencias del backend
cd server
npm install
```

3. Configurar variables de entorno:
```bash
# En la raíz del proyecto
cp .env.example .env

# En el directorio server
cd server
cp .env.example .env
```

4. Configurar la base de datos:
```bash
cd server
npx prisma migrate dev
```

5. Iniciar el proyecto:
```bash
# En una terminal, iniciar el backend
cd server
npm run dev

# En otra terminal, iniciar el frontend
cd ..
npm run dev
```

## Configuración de Variables de Entorno

El proyecto utiliza variables de entorno para la configuración. Se proporcionan archivos `.env.example` tanto en el frontend como en el backend como plantillas.

### Configuración Inicial
1. Copia los archivos de ejemplo:
```bash
# Frontend
cp .env.example .env

# Backend
cd server
cp .env.example .env
```

2. Modifica los valores según tu entorno.

### Variables Frontend (.env)
```plaintext
# URL del backend API
VITE_API_URL=http://localhost:3000  # URL donde se ejecuta el servidor
```

### Variables Backend (server/.env)
```plaintext
# Configuración del Servidor
PORT=3000                    # Puerto donde se ejecutará el servidor

# Base de Datos PostgreSQL
DATABASE_URL="postgresql://usuario:password@localhost:5432/bobscorn"
# Formato: postgresql://USUARIO:PASSWORD@HOST:PUERTO/NOMBRE_DB

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000   # Ventana de tiempo en milisegundos (1 minuto)
RATE_LIMIT_MAX_REQUESTS=1    # Máximo de compras permitidas por ventana
```

### Validación
El proyecto incluye validación de variables de entorno:
- Variables requeridas son verificadas al inicio
- Se proporcionan mensajes de error descriptivos si falta alguna variable
- Los tipos de datos son validados (números, URLs, etc.)

## Desarrollo

La aplicación estará disponible en:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Estructura del Proyecto

```
baselabs/
├── src/               # Frontend
│   ├── components/    # Componentes React
│   ├── lib/          # Utilidades y configuraciones
│   └── styles/       # Estilos CSS
├── server/           # Backend
│   ├── src/          
│   │   ├── controllers/  # Controladores
│   │   └── routes/      # Rutas API
│   └── prisma/      # Esquemas y migraciones
└── docs/            # Documentación adicional
```

## API Endpoints

- `POST /api/corn/buy`: Comprar maíz (rate limited)
- `GET /api/corn/history`: Obtener historial de compras

## Testing

La aplicación incluye tests automatizados usando Jest y React Testing Library. Los tests se enfocan en las funcionalidades críticas del negocio:

### Tests Implementados

1. **Compra de Maíz**
   - Verificación de compra exitosa
   - Manejo del rate limiting (1 compra por minuto)
   - Validación de mensajes de éxito/error

2. **Historial de Compras**
   - Visualización correcta de datos históricos
   - Formato de fechas y cantidades
   - Integración con el panel de estadísticas

### Ejecutar Tests

Para ejecutar los tests:

```bash
npm test
```

Para ejecutar los tests en modo watch:

```bash
npm test -- --watch
```


## Nota
Este proyecto fue creado como prueba técnica para BaseLabs. El código es únicamente para fines de evaluación y demostración de habilidades técnicas.