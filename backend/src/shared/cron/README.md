# 🕐 Cron Jobs - Configuración Básica

## 📦 Librerías Instaladas

- `node-cron`: Para programar tareas automáticas
- `@types/node-cron`: Tipos de TypeScript

## 📁 Archivos

```
src/shared/cron/
├── cronConfig.ts    # Configuración básica (zona horaria, horarios)
├── cronJobs.ts      # Clase para agregar tus cron jobs
├── cronManager.ts   # Manager para inicializar cron jobs
└── README.md        # Esta documentación
```

## 🚀 Uso Básico

### 1. Para agregar un cron job

Edita `cronJobs.ts` y agrega tu lógica en el método `initializeCronJobs()`:

```typescript
// Ejemplo: Ejecutar algo cada hora
cron.schedule(
  '0 * * * *',
  () => {
    console.log('Ejecutándose cada hora');
    // Tu lógica aquí
  },
  {
    timezone: 'America/Argentina/Buenos_Aires',
  }
);
```

### 2. Para inicializar automáticamente

En `app.ts` agrega:

```typescript
import { CronManager } from './shared/cron/cronManager.js';

// Después de syncSchema()
await CronManager.initializeAll();
```

### 3. Configuración

Edita `cronConfig.ts` para:

- Cambiar zona horaria
- Habilitar/deshabilitar cron jobs
- Ver ejemplos de horarios

## ⏰ Formato de Horarios Cron

```
* * * * *
│ │ │ │ │
│ │ │ │ └── Día de semana (0-7, domingo=0 o 7)
│ │ │ └──── Mes (1-12)
│ │ └────── Día del mes (1-31)
│ └──────── Hora (0-23)
└────────── Minuto (0-59)
```

### Ejemplos:

- `* * * * *` - Cada minuto
- `0 * * * *` - Cada hora
- `0 2 * * *` - Cada día a las 2:00 AM
- `0 0 * * 0` - Cada domingo a medianoche

¡Listo para personalizar según tus necesidades!
