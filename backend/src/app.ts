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
import cookieParser from 'cookie-parser';
import authRoutes from './shared/middleware/auth.routes.js';
import https from 'https';
import { stripeRouter } from './stripe/stripe.route.js';
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

// Middleware especial para webhook de Stripe (debe ir ANTES de express.json())
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));
app.use(
  '/api/stripe/webhook/split-payment',
  express.raw({ type: 'application/json' })
);

export const staticPath = !isProduction
  ? '/app/public/uploads' // Fly.io volume mount point
  : path.join(__dirname, '../public/uploads'); // Local development

console.log('📁 Static serving path:', staticPath);
console.log('📁 Directory exists:', fs.existsSync(staticPath));
// Ensure directory exists (especially important for volumes)
async function ensureDefaultAvatar() {
  try {
    const defaultAvatarPath = path.join(
      staticPath,
      'profiles',
      'default-avatar.webp'
    );

    console.log('🔍 Checking for default avatar at:', defaultAvatarPath);

    // Check if default avatar already exists
    if (!fs.existsSync(defaultAvatarPath)) {
      console.log('📁 Default avatar not found, creating...');

      // Ensure profiles directory exists
      await fs.promises.mkdir(path.join(staticPath, 'profiles'), {
        recursive: true,
      });

      // Download and save default avatar
      await downloadFile(
        'https://png.pngtree.com/png-vector/20250825/ourlarge/pngtree-orange-circle-default-avatar-profile-icon-minimal-vector-style-on-white-png-image_17276338.webp',
        defaultAvatarPath
      );

      console.log(
        '✅ Default avatar created successfully at:',
        defaultAvatarPath
      );
    } else {
      console.log('✅ Default avatar already exists');
    }

    // Test if it's accessible
    const isProduction = process.env.NODE_ENV === 'production';
    const baseUrl = isProduction
      ? process.env.BASE_URL || 'https://backend-patient-morning-1303.fly.dev'
      : 'http://localhost:3000';

    console.log(
      '🔗 Default avatar will be accessible at:',
      `${baseUrl}/uploads/profiles/default-avatar.webp`
    );
  } catch (error) {
    console.error('❌ Error ensuring default avatar:', error);
  }
}

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);

    https
      .get(url, (response) => {
        if (response.statusCode === 200) {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log('📥 Default avatar downloaded successfully');
            resolve();
          });
        } else {
          reject(new Error(`Failed to download: ${response.statusCode}`));
        }
      })
      .on('error', (err) => {
        fs.unlink(dest, () => {}); // Delete the file on error
        reject(err);
      });
  });
}

// Call this after creating upload directories but before starting the server
// Replace your existing directory creation code with this:

console.log('📁 Static serving path:', staticPath);
console.log('📁 Directory exists:', fs.existsSync(staticPath));

// Ensure directory exists and create default avatar
try {
  // ✅ Create default avatar
  await ensureDefaultAvatar();
} catch (error) {
  console.error('❌ Error creating default avatar:', error);
}

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
console.log('🔧 Configuración del entorno:');
console.log('   Archivo .env encontrado:', isLocalEnv);
console.log('   Modo local:', local);
console.log('   process.env.LOCAL:', process.env.LOCAL);
console.log('   process.env.NODE_ENV:', process.env.NODE_ENV);
// cors lo que hace es dar el permiso al un puerto para hacer las peticiones al back
// CORS dinámico (permite lista separada por comas en FRONTEND_ORIGIN)
const rawOrigins = local
  ? 'http://localhost:5173'
  : process.env.FRONTEND_ORIGIN ||
    'https://reformix.site,https://www.reformix.site';
const allowedOrigins = rawOrigins.split(',').map((o: string) => o.trim());

console.log('🌐 Configuración CORS:', {
  local,
  rawOrigins,
  allowedOrigins,
});

app.use(
  cors({
    origin: (origin, cb) => {
      // Permitir requests sin origin (como desde Postman o aplicaciones móviles)
      if (!origin) return cb(null, true);

      // Verificar si el origin está en la lista de permitidos
      if (allowedOrigins.includes(origin)) {
        return cb(null, true);
      }

      console.error('❌ CORS: Origen no permitido:', origin);
      console.error('   Orígenes permitidos:', allowedOrigins);
      return cb(new Error('Origen no permitido por CORS: ' + origin));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
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
app.use('/api/stripe', stripeRouter);

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
