import dotenv from 'dotenv';
dotenv.config(); // Carga las variables de entorno desde el archivo .env
import { Request, Response } from 'express';
import axios from 'axios';
import querystring from 'querystring'; // Importa querystring para formatear datos en formato x-www-form-urlencoded
import { orm } from '../shared/db/orm.js';
import jwt from 'jsonwebtoken';
import { putOauth, getOauth } from '../usuario/usuario.controler.js';
const em = orm.em;
// tus credenciales de app
const MP_CLIENT_ID = process.env.MP_CLIENT_ID; // ID de cliente de MercadoPago
const MP_CLIENT_SECRET = process.env.MP_CLIENT_SECRET; // Secreto de cliente de MercadoPago
const MP_REDIRECT_URI = process.env.MP_REDIRECT_URI; // URI de redirección configurada en MercadoPago

async function connect(req: Request, res: Response) {
  try {
    // Intentamos leer el userId desde query param (para apuntar a un usuario específico)
    let userId: number;
    if (req.query.userId) {
      userId = Number(req.query.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'userId inválido' });
      }
    } else {
      const authHeader = req.headers.authorization; // obtiene el token Bearer
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res
          .status(401)
          .json({ error: 'Token de autorización requerido' });
      }
      const token = authHeader.substring(7); // Extrae el token JWT
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'dev_secret'
      ) as any;
      userId = decoded.id; // Obtiene el ID de usuario del token
    }

    // Guardar el userId en la sesión o estado para el callback
    const state = Buffer.from(JSON.stringify({ userId })).toString('base64'); // Codifica el userId en base64 para el parámetro state

    const url = `https://auth.mercadopago.com/authorization?response_type=code&client_id=${MP_CLIENT_ID}&redirect_uri=${MP_REDIRECT_URI}&state=${state}`; // Construye la URL de autorización de MercadoPago
    console.log('Redirigiendo a:', url); // Muestra la URL en consola
    res.redirect(url); // Redirige al usuario a MercadoPago para autorizar
  } catch (error) {
    console.error('Error en connect:', error); // Muestra el error en consola
    res.status(401).json({ error: 'Token inválido' }); // Retorna error si el token es inválido
  }
}

async function callback(req: Request, res: Response) {
  // Soporte de userId en query (para indicar usuario explícitamente)
  const state = req.query.state as string;
  let userId: number;
  if (req.query.userId) {
    userId = Number(req.query.userId);
    if (isNaN(userId)) return res.status(400).send('userId inválido');
  } else {
    if (!state) return res.status(400).send('Falta state');
    // Decodificar el state para obtener el userId
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
    userId = stateData.userId;
  }
  let code: string = '';
  if (typeof req.query.code === 'string') {
    code = req.query.code; // Si el código es string, lo asigna
  } else if (
    Array.isArray(req.query.code) &&
    typeof req.query.code[0] === 'string'
  ) {
    code = req.query.code[0]; // Si es array, toma el primer elemento
  }

  if (!code) return res.status(400).send('Falta code'); // Retorna error si falta el código

  try {
    // Decodificar el state para obtener el userId
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString()); // Decodifica el state en base64 y lo convierte a objeto
    const userId = stateData.userId; // Obtiene el userId

    const params = querystring.stringify({
      grant_type: 'authorization_code',
      client_id: MP_CLIENT_ID,
      client_secret: MP_CLIENT_SECRET,
      code: code,
      redirect_uri: MP_REDIRECT_URI,
    }); // Prepara los parámetros para solicitar el token

    const tokenResp = await axios.post(
      'https://api.mercadopago.com/oauth/token',
      params,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    ); // Solicita el token a MercadoPago

    const body = tokenResp.data; // Obtiene la respuesta con los tokens
    console.log('=== TOKENS DEL VENDEDOR ===');
    console.log(body); // Muestra los tokens en consola
    const mpTokenExpiration = new Date(Date.now() + body.expires_in * 1000);
    putOauth(
      body.id_usuario,
      body.access_token,
      body.refresh_token,
      body.user_id,
      body.public_key,
      mpTokenExpiration
    );
    console.log('Tokens guardados para usuario:', userId); // Muestra mensaje en consola
    // Redirigir al frontend con éxito (NO enviar tokens sensibles)
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?mp_connected=true`); // Redirige al frontend indicando éxito
  } catch (err) {
    const error = err as any;
    console.error('Error en callback:', error.response?.data || error.message); // Muestra el error en consola
    res.status(500).send('Error en callback OAuth'); // Retorna error si falla el proceso
  }
}

async function refresh(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization; // Obtiene el header de autorización
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Verifica si el token existe y es Bearer
      return res.status(401).json({ error: 'Token de autorización requerido' }); // Retorna error si no hay token
    }

    const token = authHeader.substring(7); // Extrae el token JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'dev_secret'
    ) as any; // Verifica y decodifica el token JWT
    const userId = decoded.id; // Obtiene el ID de usuario del token

    const usuario = await getOauth(userId); // Busca el usuario en la base de datos
    if (!usuario || !usuario.mpRefreshToken) {
      return res
        .status(404)
        .json({ error: 'Usuario sin tokens de MercadoPago' }); // Retorna error si no tiene refresh token
    }

    const params = querystring.stringify({
      grant_type: 'refresh_token',
      client_id: MP_CLIENT_ID,
      client_secret: MP_CLIENT_SECRET,
      refresh_token: usuario.mpRefreshToken,
    }); // Prepara los parámetros para refrescar el token

    const tokenResp = await axios.post(
      'https://api.mercadopago.com/oauth/token',
      params,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    ); // Solicita el nuevo token a MercadoPago

    const body = tokenResp.data; // Obtiene la respuesta con los nuevos tokens
    console.log('=== REFRESH TOKEN ===');
    console.log(body); // Muestra los tokens en consola

    // Actualizar tokens en la base de datos
    usuario.mpAccessToken = body.access_token; // Actualiza el access token
    if (body.refresh_token) {
      usuario.mpRefreshToken = body.refresh_token; // Actualiza el refresh token si viene en la respuesta
    }
    if (body.expires_in) {
      usuario.mpTokenExpiration = new Date(Date.now() + body.expires_in * 1000); // Actualiza la fecha de expiración
    }

    await em.persistAndFlush(usuario); // Guarda los cambios en la base de datos

    res.json({ ok: true, message: 'Tokens actualizados correctamente' }); // Retorna éxito
  } catch (err) {
    const error = err as any;
    console.error(
      'Error refresh token:',
      error.response?.data || error.message
    ); // Muestra el error en consola
    res.status(500).send('Error refrescando token'); // Retorna error si falla el proceso
  }
}

async function status(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization; // Obtiene el header de autorización
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Verifica si el token existe y es Bearer
      return res.status(401).json({ error: 'Token de autorización requerido' }); // Retorna error si no hay token
    }

    const token = authHeader.substring(7); // Extrae el token JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'dev_secret'
    ) as any; // Verifica y decodifica el token JWT
    const userId = decoded.id; // Obtiene el ID de usuario del token

    const usuario = await getOauth(userId); // Busca el usuario en la base de datos
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' }); // Retorna error si no existe
    }

    const isConnected = !!(usuario.mpAccessToken && usuario.mpUserId); // Verifica si está conectado a MercadoPago
    const isExpired = usuario.mpTokenExpiration
      ? usuario.mpTokenExpiration < new Date()
      : false; // Verifica si el token está expirado

    res.json({
      connected: isConnected,
      expired: isExpired,
      user_id: usuario.mpUserId || null,
      public_key: usuario.mpPublicKey || null,
      expires_at: usuario.mpTokenExpiration || null,
    }); // Retorna el estado de conexión
  } catch (error) {
    console.error('Error verificando estado MP:', error); // Muestra el error en consola
    res.status(500).json({ error: 'Error interno del servidor' }); // Retorna error genérico
  }
}
export default {
  connect,
  callback,
  refresh,
  status,
};
