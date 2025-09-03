# Integración MercadoPago OAuth con Split de Pagos

## Descripción

Esta implementación permite a los usuarios conectar sus cuentas de MercadoPago mediante OAuth para recibir pagos con split automático (comisión para la plataforma).

## Estructura de Rutas

```
/api/mercadopago/
├── oauth/
│   ├── GET /connect          # Iniciar conexión OAuth
│   ├── GET /callback         # Callback automático de MP
│   ├── GET /status          # Verificar estado de conexión
│   ├── POST /refresh        # Refrescar token
│   ├── POST /disconnect     # Desconectar cuenta
│   └── POST /create-payment # Crear pago con split
└── webhooks/
    ├── POST /payment-status-change    # Webhook de cambios de estado
    └── POST /verify-payment/:id       # Verificar estado de pago
```

## Flujo de OAuth

### 1. Conectar cuenta de MercadoPago

```http
GET /api/mercadopago/oauth/connect
Authorization: Bearer {jwt_token}
```

- Redirige al usuario a MercadoPago para autorizar la aplicación
- Requiere autenticación con JWT

### 2. Callback automático

```http
GET /api/mercadopago/oauth/callback?code={code}&state={state}
```

- MercadoPago redirige aquí después de la autorización
- Guarda automáticamente los tokens en la base de datos
- Redirige al frontend con confirmación

### 3. Verificar estado de conexión

```http
GET /api/mercadopago/oauth/status
Authorization: Bearer {jwt_token}
```

Respuesta:

```json
{
  "connected": true,
  "expired": false,
  "user_id": "123456789",
  "public_key": "APP_USR-...",
  "expires_at": "2025-09-01T12:00:00.000Z"
}
```

### 4. Refrescar token (automático cuando expire)

```http
POST /api/mercadopago/oauth/refresh
Authorization: Bearer {jwt_token}
```

### 5. Desconectar cuenta

```http
POST /api/mercadopago/oauth/disconnect
Authorization: Bearer {jwt_token}
```

## Crear Pago con Split

```http
POST /api/mercadopago/oauth/create-payment
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "transaction_amount": 100.00,
  "token": "payment_token_from_frontend",
  "payment_method_id": "visa",
  "payer_email": "buyer@email.com",
  "description": "Servicio de plomería",
  "installments": 1,
  "commission_percentage": 0.05
}
```

Respuesta:

```json
{
  "success": true,
  "payment": {
    "id": 123456789,
    "status": "approved"
    // ... otros campos de MercadoPago
  },
  "commission_info": {
    "total_amount": 100.0,
    "application_fee": 5.0,
    "vendor_amount": 95.0
  }
}
```

## Configuración Requerida

### Variables de Entorno

```env
MP_CLIENT_ID=tu_client_id
MP_CLIENT_SECRET=tu_client_secret
MP_REDIRECT_URI=https://tu-backend.com/api/mp/callback
FRONTEND_URL=https://tu-frontend.com
JWT_SECRET=tu_jwt_secret
```

### Base de Datos

Ejecutar la migración:

```sql
-- Ver archivo: backend/migrations/add_mercadopago_fields.sql
ALTER TABLE usuario ADD COLUMN mp_access_token TEXT NULL;
ALTER TABLE usuario ADD COLUMN mp_refresh_token TEXT NULL;
ALTER TABLE usuario ADD COLUMN mp_user_id VARCHAR(255) NULL;
ALTER TABLE usuario ADD COLUMN mp_public_key TEXT NULL;
ALTER TABLE usuario ADD COLUMN mp_token_expiration DATETIME NULL;
```

## Configuración en MercadoPago

1. Ir a https://www.mercadopago.com/developers/
2. Crear aplicación
3. Configurar OAuth redirect URI: `https://tu-backend.com/api/mp/callback`
4. Obtener Client ID y Client Secret

## Seguridad

- ✅ Tokens almacenados de forma segura en la base de datos
- ✅ Verificación de expiración automática
- ✅ Autenticación JWT requerida para todas las operaciones
- ✅ No se exponen tokens sensibles al frontend
- ✅ Validación de parámetros en todos los endpoints

## Funcionamiento del Split

- **Monto total**: Lo que paga el cliente
- **Application Fee**: Comisión que se queda tu plataforma (configurable)
- **Monto vendedor**: Lo que recibe el prestador del servicio
- El split se procesa automáticamente por MercadoPago

## Webhook (Opcional)

```
POST /api/mp/webhooks
```

Recibe notificaciones de MercadoPago sobre cambios en los pagos.

## Frontend Integration

### 1. Conectar MercadoPago

```javascript
// Redirigir a la URL de conexión
window.location.href = '/api/mp/connect';
```

### 2. Verificar estado

```javascript
const response = await fetch('/api/mp/status', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
const status = await response.json();
```

### 3. Crear pago

```javascript
const paymentData = {
  transaction_amount: 100.0,
  token: cardToken, // Token generado por MercadoPago.js
  payment_method_id: 'visa',
  payer_email: 'buyer@email.com',
  commission_percentage: 0.05,
};

const response = await fetch('/api/mp/create-payment', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(paymentData),
});
```

## Mejoras Implementadas

1. **Persistencia de tokens**: Los tokens se guardan en la base de datos
2. **Seguridad mejorada**: Autenticación JWT en todos los endpoints
3. **Manejo de expiración**: Verificación automática de tokens expirados
4. **Split configurables**: Porcentaje de comisión personalizable
5. **Estados claros**: Endpoints para verificar conexión y estado
6. **Limpieza de datos**: Posibilidad de desconectar cuenta
7. **Logs detallados**: Información clara sobre comisiones y splits
