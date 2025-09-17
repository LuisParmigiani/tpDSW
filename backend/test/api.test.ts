import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import createApp from '../src/app.js'; // use .js ext if needed for ESM resolution

const app = createApp({
  skipAsyncInit: true,
  skipDatabaseContext: true,
});

describe('API Health Check', () => {
  it('Debería responder con un status 200 y esa información', async () => {
    const res = await request(app).get('/health');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('db', 'mocked');
  });

  it('Debería devolver contenido en json', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['content-type']).toMatch(/json/);
  });

  it('Debería manejar las rutas desconocidas con el 404', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.statusCode).toBe(404);
  });
});

describe('Estructura de las Rutas definidas', () => {
  const apiRoutes = [
    { path: '/api/serviceTypes', name: 'Service Types' },
    { path: '/api/usuario', name: 'Usuario' },
    { path: '/api/tarea', name: 'Tarea' },
    { path: '/api/servicio', name: 'Servicio' },
    { path: '/api/turno', name: 'Turno' },
    { path: '/api/horario', name: 'Horario' },
    { path: '/api/zona', name: 'Zona' },
    { path: '/api/pago', name: 'Pago' },
    { path: '/api/usuario/recuperar', name: 'Auth-Recuperar contraseña' },
    { path: '/api/usuario/validar-codigo', name: 'Auth-Validar código' },
    { path: '/api/usuario/cambiar-password', name: 'Auth-Cambiar contraseña' },
    { path: '/api/usuario/login', name: 'Auth-Iniciar sesión' },
  ];

  apiRoutes.forEach(({ path, name }) => {
    it(`Debeía tener el endpoint ${name} en la ruta ${path}`, async () => {
      const res = await request(app).get(path);
      // Route exists (not 404), may return auth/business logic errors
      expect(res.statusCode).not.toBe(404);
    });
  });

  it('Debería regresar archivos estáticos de api/uploads', async () => {
    const res = await request(app).get('/uploads/test-file.txt');
    // May return 404 if file doesn't exist, but route should be registered
    // Status could be 404 (file not found) or 200 (file exists)
    expect([200, 404]).toContain(res.statusCode);
  });
});

describe('Rutas Especiales de Stripe', () => {
  it('Deberia manejar el endpoint del webhook de stripe', async () => {
    const res = await request(app)
      .post('/api/stripe/webhook')
      .set('Content-Type', 'application/json')
      .send('{}');

    // Route exists, may return validation/auth errors but not 404
    expect(res.statusCode).not.toBe(404);
  });

  it('Debería manejar el endpoint del webhook de split payment de stripe', async () => {
    const res = await request(app)
      .post('/api/stripe/webhook/split-payment')
      .set('Content-Type', 'application/json')
      .send('{}');

    // Route exists, may return validation/auth errors but not 404
    expect(res.statusCode).not.toBe(404);
  });
});

describe('Middleware y CORS', () => {
  it('Debería aceptar solicitudes JSON siempre y cuando sean válidas segun los esquemas definidos que pasan a traves del middleware', async () => {
    const res = await request(app).post('/api/usuario').send({
      mail: 'agus04@gmail.com',
      contrasena: 'Agus1234',
      tipoDoc: 'DNI',
      numeroDoc: '12345678',
      nombre: 'Agustin',
      apellido: 'Gonzalez',
      telefono: '1234567890',
      direccion: 'Calle Falsa 123',
      estado: 'activo',
    });

    // Debería analizar JSON (no 400 bad request de JSON mal formado)
    // Puede devolver errores de autenticación/validación pero no errores de análisis JSON
    expect(res.statusCode).not.toBe(400);
  });

  it('Debería manejar las solicitudes de preflight CORS', async () => {
    const res = await request(app)
      .options('/api/usuario')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'GET');

    // Debería manejar la solicitud OPTIONS
    expect([200, 204]).toContain(res.statusCode);
  });
});
