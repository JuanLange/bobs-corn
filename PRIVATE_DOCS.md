# Documentación Privada del Proyecto BaseLabs

## Flujos de la Aplicación

### Estructura del Proyecto
```
baselabs/
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── pages/         # Páginas principales
│   ├── hooks/         # Custom hooks
│   ├── services/      # Servicios de API
│   ├── utils/         # Utilidades y helpers
│   ├── types/         # Tipos de TypeScript
│   └── styles/        # Estilos globales
├── tests/            # Tests unitarios y de integración
└── server/          # Backend con Express y PostgreSQL
```

### Estructura de la Base de Datos

### Tabla: corn_purchases
```sql
CREATE TABLE corn_purchases (
    id SERIAL PRIMARY KEY,
    client_ip VARCHAR(45) NOT NULL,
    purchase_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN DEFAULT true
);

-- Índice para optimizar las consultas de rate limiting
CREATE INDEX idx_purchases_ip_time ON corn_purchases(client_ip, purchase_time);
```

### Flujos Principales
#### 1. Flujo de Compra
1. Cliente hace clic en "Comprar Maíz"
2. Frontend envía POST a /api/corn/buy
3. Backend:
   - Obtiene IP del cliente
   - Verifica último intento de compra
   - Aplica rate limiting (1 por minuto)
   - Registra la transacción
4. Frontend:
   - Muestra toast de éxito/error
   - Actualiza contador de tiempo
   - Refresca tabla de historial

#### 2. Flujo de Historial
1. Frontend solicita GET /api/corn/history
2. Backend:
   - Consulta las últimas compras
   - Agrupa por IP
   - Calcula estadísticas
3. Frontend muestra datos en tabla Shadcn

### Implementación del Rate Limiting

```sql
-- Función para verificar rate limit
CREATE OR REPLACE FUNCTION check_rate_limit(client_ip VARCHAR(45))
RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1 
        FROM corn_purchases 
        WHERE client_ip = $1 
        AND success = true
        AND purchase_time > NOW() - INTERVAL '1 minute'
    );
END;
$$ LANGUAGE plpgsql;
```

### Componentes Frontend

#### 1. CornPurchase
- Botón de compra
- Contador de tiempo
- Integración con toast/sonner

#### 2. PurchaseHistory
- Tabla con columnas:
  - IP del cliente
  - Total de compras
  - Última compra
- Paginación
- Ordenamiento

### Testing

#### Backend Tests
1. Rate Limiting
   - Pruebas unitarias para función check_rate_limit
   - Pruebas de integración para endpoint
   - Pruebas de carga (100 requests/segundo)

#### Frontend Tests
1. Componentes
   - Render tests
   - User interaction tests
   - Error handling

### Notas de Implementación
- Los comentarios en el código están en inglés y en primera persona
- Seguimos las mejores prácticas de React y TypeScript
- Utilizamos Tailwind para estilos consistentes
- Implementamos animaciones con Framer Motion para mejor UX

### Decisiones Técnicas
1. Uso de Sonner sobre Toast porque:
   - Mejor animación
   - Más personalizable
   - Mejor soporte para múltiples notificaciones

2. PostgreSQL para rate limiting:
   - Consistencia en entornos distribuidos
   - Mejor manejo de concurrencia
   - Facilidad de escalar horizontalmente

### Mejoras Futuras
1. Implementar cache con Redis
2. Añadir autenticación de usuarios
3. Dashboard de administración

### Configuraciones Importantes
[Esta sección contendrá configuraciones sensibles y notas privadas]
