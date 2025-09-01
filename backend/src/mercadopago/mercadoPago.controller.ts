import { MercadoPagoConfig, Preference } from 'mercadopago';
import express, { Request, Response } from 'express';

const mercadoPago = express.Router();

// Inicializamos cliente de Mercado Pago con token de sandbox
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!, // asegurate que sea de prueba si estás en sandbox
});

const preference = new Preference(client);

mercadoPago.post('/', async (req: Request, res: Response) => {
  try {
    const { id, title, quantity, unit_price, secondaryEmail, turno } = req.body;

    // Validación básica
    if (!title || !unit_price || !quantity) {
      return res.status(400).json({
        error: 'Faltan datos requeridos: title, unit_price o quantity',
      });
    }

    console.log('🔹 Creando preferencia con data:', req.body);
    // TODO: Reemplaza 'ID_DEL_VENDEDOR_SECUNDARIO' por el user_id real del vendedor secundario (mail de prueba)
    const result = await preference.create({
      body: {
        items: [
          {
            id: id || 'product-001',
            title: title,
            quantity: Number(quantity),
            unit_price: Number(unit_price),
            currency_id: 'ARS',
          },
        ],
        back_urls: {
          success: 'https://reformix.site/historial/success',
          failure: 'https://reformix.site/historial/failure',
          pending: 'https://reformix.site/historial/pending',
        },
        auto_return: 'approved',
        notification_url:
          'https://backend-patient-morning-1303.fly.dev/api/mercadopago/cambio',
        external_reference: turno || undefined,
        marketplace: 'Reformix',
      } as any,
    });

    console.log('✅ Preferencia creada:', result);

    res.json({
      preferenceId: result.id,
      init_point: result.init_point, // URL para redirigir al checkout
      sandbox_init_point: result.sandbox_init_point, // URL de sandbox (si corresponde)
    });
  } catch (error: any) {
    console.error('❌ Error al crear preferencia:', error);
    res.status(500).json({
      error: 'Error al crear preferencia',
      details: error.message || error,
    });
  }
});

export default mercadoPago;

// ------------------------------------------------------------------------------------------------------
const MP_PAYMENTS_URL = 'https://api.mercadopago.com/v1/payments'; // URL para crear pagos en MercadoPago
// 4) Crear pago con split (usando tokens guardados)
// router.post('/create-payment', async (req: Request, res: Response) => {
//   try {
//     const authHeader = req.headers.authorization; // Obtiene el header de autorización
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       // Verifica si el token existe y es Bearer
//       return res.status(401).json({ error: 'Token de autorización requerido' }); // Retorna error si no hay token
//     }

//     const token = authHeader.substring(7); // Extrae el token JWT
//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET || 'dev_secret'
//     ) as any; // Verifica y decodifica el token JWT
//     const vendedorId = decoded.id; // Obtiene el ID del vendedor del token

//     const {
//       transaction_amount,
//       token: paymentToken,
//       payment_method_id = 'visa',
//       payer_email,
//       description = 'Pago de servicio',
//       installments = 1,
//       commission_percentage = 0.05, // 5% de comisión por defecto
//     } = req.body; // Extrae los datos del pago del body

//     if (!transaction_amount || !paymentToken || !payer_email) {
//       return res.status(400).json({
//         error:
//           'Faltan campos requeridos: transaction_amount, token, payer_email',
//       }); // Retorna error si faltan campos requeridos
//     }

//     // Obtener tokens del vendedor
//     const vendedor = await em.findOne(Usuario, { id: vendedorId }); // Busca el vendedor en la base de datos
//     if (!vendedor || !vendedor.mpAccessToken) {
//       return res
//         .status(404)
//         .json({ error: 'Usuario sin configuración de MercadoPago' }); // Retorna error si no tiene configuración de MercadoPago
//     }

//     // Verificar si el token ha expirado
//     if (vendedor.mpTokenExpiration && vendedor.mpTokenExpiration < new Date()) {
//       return res
//         .status(401)
//         .json({ error: 'Token de MercadoPago expirado. Renovar conexión.' }); // Retorna error si el token expiró
//     }

//     // Calcular comisión
//     const applicationFee =
//       Math.round(transaction_amount * commission_percentage * 100) / 100; // Calcula la comisión de la aplicación

//     const payload = {
//       transaction_amount: parseFloat(transaction_amount), // Monto total
//       token: paymentToken, // Token de pago
//       description, // Descripción del pago
//       payment_method_id, // Método de pago
//       installments: parseInt(installments), // Cantidad de cuotas
//       payer: {
//         email: payer_email, // Email del pagador
//       },
//       application_fee: applicationFee, // Comisión de la aplicación
//       metadata: {
//         vendedor_id: vendedorId, // ID del vendedor
//         commission_percentage: commission_percentage, // Porcentaje de comisión
//       },
//     }; // Prepara el payload para MercadoPago

//     const response = await axios.post(MP_PAYMENTS_URL, payload, {
//       headers: {
//         Authorization: `Bearer ${vendedor.mpAccessToken}`, // Token de acceso del vendedor
//         'Content-Type': 'application/json', // Tipo de contenido
//       },
//     }); // Crea el pago en MercadoPago

//     console.log('=== PAGO CREADO CON SPLIT ===');
//     console.log('Monto total:', transaction_amount);
//     console.log('Comisión aplicación:', applicationFee);
//     console.log('Monto para vendedor:', transaction_amount - applicationFee);
//     console.log('Respuesta MP:', response.data); // Muestra información del pago en consola

//     // Aquí podrías guardar el pago en tu base de datos
//     // const nuevoPago = new Pago({...});
//     // await em.persistAndFlush(nuevoPago);

//     res.json({
//       success: true,
//       payment: response.data,
//       commission_info: {
//         total_amount: transaction_amount,
//         application_fee: applicationFee,
//         vendor_amount: transaction_amount - applicationFee,
//       },
//     }); // Retorna la información del pago y la comisión
//   } catch (err) {
//     if (typeof err === 'object' && err !== null && 'response' in err) {
//       const error = err as { response?: { data?: any }; message?: string };
//       console.error(
//         'Error creando pago:',
//         error.response?.data || error.message
//       ); // Muestra el error en consola
//       res.status(500).json({
//         error: 'Error creando pago',
//         details: error.response?.data,
//       }); // Retorna error si falla el proceso
//     } else {
//       console.error('Error creando pago:', (err as Error).message); // Muestra el error en consola
//       res.status(500).json({ error: 'Error interno del servidor' }); // Retorna error genérico
//     }
//   }
// });
