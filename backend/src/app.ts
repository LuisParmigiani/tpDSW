import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { usuarioRouter } from './usuario/usuario.route.js';
import { tareaRouter } from './tarea/tarea.route.js';
import { servicioRouter } from './servicio/servicio.route.js';
import { turnoRouter } from './turno/turno.route.js';
import 'reflect-metadata';
import { orm, syncSchema } from './shared/db/orm.js';
import { zonaRouter } from './zona/zona.route.js';
import { RequestContext } from '@mikro-orm/core';
import { serviceTypeRouter } from './tipoServicio/tipoServ.route.js';
import { horarioRouter } from './horario/horario.routes.js';
import { CronManager } from './shared/cron/cronManager.js';
import { PagoRouter } from './pago/pago.route.js';
import { webhookRouter } from './mercadopago/mercadoPago.route.js';
import cookieParser from 'cookie-parser';
import authRoutes from './shared/middleware/auth.routes.js';

// Tuve que recrear __dirname xq no estaba definido xq estamos usando ES Modules y no COmmonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar .env solo si existe para distinguir modo local de producción
// Buscar .env en la raíz del proyecto (subir dos niveles desde src)
const envPath = path.join(__dirname, '../../.env');
const isLocalEnv = fs.existsSync(envPath);
if (isLocalEnv) {
  dotenv.config({ path: envPath });
}
const app = express();
//Configuro el body parser para que tenga un límite más grande, sino las imagenes no podían llegar
//hasta el middleware

const isProduction = process.env.NODE_ENV === 'production';

const staticPath = isProduction
  ? '/app/public/uploads' // Fly.io volume mount point
  : path.join(__dirname, '../../public/uploads'); // Local development

console.log('📁 Static serving path:', staticPath);

// Ensure directory exists (especially important for volumes)
try {
  await fs.promises.mkdir(path.join(staticPath, 'profiles'), {
    recursive: true,
  });
  console.log('✅ Upload directories ready');
} catch (error) {
  console.error('❌ Error creating upload directories:', error);
}
app.use('/uploads', express.static(staticPath));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
// Como las variables de env son siempre string, tiene que comparar si es igual a 'true', entonces almacena el booleano de js

// Definir modo local según existencia de .env
const local = isLocalEnv;
console.log('Modo local (archivo .env encontrado):', local);
// cors lo que hace es dar el permiso al un puerto para hacer las peticiones al back
// CORS dinámico (permite lista separada por comas en FRONTEND_ORIGIN)
const rawOrigins = local
  ? 'http://localhost:5173'
  : process.env.FRONTEND_ORIGIN || 'https://reformix.site';
const allowedOrigins = rawOrigins.split(',').map((o) => o.trim());
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error('Origen no permitido: ' + origin));
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next: NextFunction) => {
  RequestContext.create(orm.em, next);
});

app.use('/api/serviceTypes', serviceTypeRouter);
app.use('/api/usuario', usuarioRouter);
app.use('/api/tarea', tareaRouter);
app.use('/api/servicio', servicioRouter);
app.use('/api/turno', turnoRouter);
app.use('/api/horario', horarioRouter);
app.use('/api/zona', zonaRouter);
app.use('/api/pago', PagoRouter);
app.use('/api/auth', authRoutes);

// MercadoPago routes - agrupadas
// Rutas de MercadoPago (webhooks y OAuth)
app.use('/api/mercadopago', webhookRouter);

if (local) {
  console.log('LOCAL_MODE=true -> syncSchema habilitado');
  await syncSchema();
} else if (process.env.RUN_SYNC_SCHEMA === '1') {
  console.log('RUN_SYNC_SCHEMA=1 (override) -> ejecutando syncSchema una vez');
  await syncSchema();
} else {
  console.log('Producción -> syncSchema omitido');
}

// Cron jobs sólo si no están deshabilitados
if (!local && process.env.DISABLE_CRONS === '1') {
  console.log('Producción con DISABLE_CRONS=1 -> cron deshabilitado');
} else {
  await CronManager.initializeAll();
  console.log('Cron jobs inicializados');
}

// Endpoint básico para verificar la salud del servidor y la conexión a la base de datos
app.get('/health', async (req: Request, res: Response) => {
  try {
    // Verifica la conexión a la base de datos ejecutando una consulta simple
    await orm.em.fork().getConnection().execute('SELECT 1');
    return res.json({ status: 'ok', db: 'up' }); // Responde que todo está funcionando
  } catch (e) {
    return res.status(500).json({ status: 'error', db: 'down' }); // Responde que hay un problema
  }
});

// Define el puerto en el que se ejecutará el servidor
console.log(local);
const port = local ? 3000 : Number(process.env.PORT) || 8080; // Fly asigna PORT
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

/* app.listen(3000, () => {
    console.log('Server runnning on http://localhost:3000');
  }); */
