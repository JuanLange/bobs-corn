# Bob's Corn 🌽

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

## Licencia

Este proyecto es distribuido bajo la licencia [MIT](https://choosealicense.com/licenses/mit/).