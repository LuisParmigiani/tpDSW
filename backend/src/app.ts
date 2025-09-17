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
import { zonaRouter } from './zona/zona.route.js';
import { serviceTypeRouter } from './tipoServicio/tipoServ.route.js';
import { horarioRouter } from './horario/horario.routes.js';
import { PagoRouter } from './pago/pago.route.js';
import cookieParser from 'cookie-parser';
import authRoutes from './shared/middleware/auth.routes.js';
import https from 'https';
import { stripeRouter } from './stripe/stripe.route.js';

// ⚠️ MOVED: Only import these when actually needed (not at module level)
// import 'reflect-metadata';
// import { orm, syncSchema } from './shared/db/orm.js';
// import { RequestContext } from '@mikro-orm/core';
// import { CronManager } from './shared/cron/cronManager.js';

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Silenciar logs de dotenv si estuvieran habilitados externamente
if (process.env.DOTENV_CONFIG_DEBUG) {
  delete process.env.DOTENV_CONFIG_DEBUG;
}

// Load .env only if it exists to distinguish local from production mode
const envPath = path.join(__dirname, '../../.env');
const isLocalEnv = fs.existsSync(envPath);
if (isLocalEnv && process.env.__DOTENV_ALREADY_CONFIGURED !== '1') {
  dotenv.config({ path: envPath });
  process.env.__DOTENV_ALREADY_CONFIGURED = '1';
}

const isProduction = process.env.NODE_ENV === 'production';

// Ajuste: local -> carpeta dentro del proyecto; producción -> volumen Fly.io
export const staticPath = isLocalEnv
  ? path.join(__dirname, '../public/uploads')
  : '/app/public/uploads';

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

async function ensureDefaultAvatar() {
  try {
    const defaultAvatarPath = path.join(
      staticPath,
      'profiles',
      'default-avatar.webp'
    );

    console.log('🔍 Checking for default avatar at:', defaultAvatarPath);

    if (!fs.existsSync(defaultAvatarPath)) {
      console.log('📁 Default avatar not found, creating...');

      await fs.promises.mkdir(path.join(staticPath, 'profiles'), {
        recursive: true,
      });

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

// 🆕 NEW: Factory function to create app instance
export function createApp(
  options = { skipAsyncInit: false, skipDatabaseContext: false }
) {
  const app = express();

  // Middleware especial para webhook de Stripe (debe ir ANTES de express.json())
  app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));
  app.use(
    '/api/stripe/webhook/split-payment',
    express.raw({ type: 'application/json' })
  );

  // Static file serving
  app.use('/uploads', express.static(staticPath));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // CORS configuration
  const local = isLocalEnv;
  const rawOrigins = local
    ? 'http://localhost:5173'
    : process.env.FRONTEND_ORIGIN ||
      'https://reformix.site,http://www.reformix.site';
  const allowedOrigins = rawOrigins.split(',').map((o: string) => o.trim());

  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (allowedOrigins.includes(origin)) {
          return cb(null, true);
        }
        console.error('❌ CORS: Origen no permitido:', origin);
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

  // 🔧 Database context middleware (can be skipped for tests)
  if (!options.skipDatabaseContext) {
    app.use(async (req, res, next: NextFunction) => {
      // Lazy import database modules only when needed
      const { RequestContext } = await import('@mikro-orm/core');
      const { orm } = await import('./shared/db/orm.js');
      RequestContext.create(orm.em, next);
    });
  } else {
    // Mock middleware for tests
    app.use((req, res, next: NextFunction) => {
      next();
    });
  }

  // All API routes
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

  // Health endpoint
  app.get('/health', async (req: Request, res: Response) => {
    if (options.skipAsyncInit) {
      // For tests: return mocked success
      return res.status(200).json({ status: 'ok', db: 'mocked' });
    }

    try {
      // Lazy import database modules only when needed
      const { orm } = await import('./shared/db/orm.js');
      await orm.em.fork().getConnection().execute('SELECT 1');
      return res.status(200).json({ status: 'ok', db: 'up' });
    } catch (e) {
      return res.status(500).json({ status: 'error', db: 'down' });
    }
  });

  return app;
}

// 🆕 NEW: Async initialization function
export async function initializeApp() {
  // Import database modules here (not at module level)
  await import('reflect-metadata');
  const { syncSchema } = await import('./shared/db/orm.js');
  const { CronManager } = await import('./shared/cron/cronManager.js');

  console.log('📁 Static serving path:', staticPath);
  console.log('📁 Directory exists:', fs.existsSync(staticPath));

  // Environment configuration logging
  const local = isLocalEnv;
  console.log('🔧 Configuración del entorno:');
  console.log('   Archivo .env encontrado:', isLocalEnv);
  console.log('   Modo local:', local);
  console.log('   process.env.LOCAL:', process.env.LOCAL);
  console.log('   process.env.NODE_ENV:', process.env.NODE_ENV);

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

  // Create upload directories and default avatar
  try {
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

  // Database schema sync
  if (local) {
    console.log('LOCAL_MODE=true -> syncSchema habilitado');
    await syncSchema();
  } else if (process.env.RUN_SYNC_SCHEMA === '1') {
    console.log(
      'RUN_SYNC_SCHEMA=1 (override) -> ejecutando syncSchema una vez'
    );
    await syncSchema();
  } else {
    console.log('Producción -> syncSchema omitido');
  }

  // Cron jobs initialization
  if (!local && process.env.DISABLE_CRONS === '1') {
    console.log('Producción con DISABLE_CRONS=1 -> cron deshabilitado');
  } else {
    await CronManager.initializeAll();
    console.log('Cron jobs inicializados');
  }
}

// 🔄 PRESERVED: Original startup logic (only runs when file is executed directly)
const isMainModule =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1] as string);

if (isMainModule) {
  // Evitar top-level await: IIFE async
  void (async () => {
    const app = createApp();
    await initializeApp();

    const port = Number(process.env.PORT) || (isLocalEnv ? 3000 : 8080);
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })();
}

// 🔄 PRESERVED: Default export for backward compatibility
export default createApp;
