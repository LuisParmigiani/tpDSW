import { Request, Response } from 'express';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { Pago, EstadoPago } from '../pago/pago.entity.js';
import { orm } from '../shared/db/orm.js';

const em = orm.em;

// Configurar MercadoPago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

const payment = new Payment(client);

// Webhook para recibir notificaciones de MercadoPago
async function mercadoPagoWebhook(req: Request, res: Response) {
  try {
    console.log('🔔 Webhook recibido:', req.body);
    const { type, data } = req.body;

    // Verificar que es una notificación de pago
    if (type === 'payment') {
      const paymentId = data.id;

      console.log(`📥 Procesando pago ID: ${paymentId}`);

      // Obtener información completa del pago desde MercadoPago
      const paymentInfo = await payment.get({ id: paymentId });

      // Actualizar el pago en nuestra base de datos
      await actualizarPagoDesdeWebhook(paymentInfo);

      console.log(`✅ Pago ${paymentId} procesado exitosamente`);
    } else {
      console.log(`ℹ️ Tipo de notificación no manejada: ${type}`);
    }

    // CRÍTICO: Responder 200 OK para confirmar recepción
    res.status(200).json({
      received: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('❌ Error procesando webhook:', error);
    res.status(200).json({
      received: true,
      error: 'Processed with errors',
      timestamp: new Date().toISOString(),
    });
  }
}

// Función interna para actualizar pago desde webhook
async function actualizarPagoDesdeWebhook(paymentInfo: any) {
  // Usar fork para transacciones para crear una nueva instancia de EntityManager
  const emFork = em.fork();

  try {
    // Buscar el pago por ID de MercadoPago
    const pagoExistente = await emFork.findOne(
      Pago,
      {
        idMercadoPago: paymentInfo.id.toString(),
      },
      { populate: ['turno'] }
    );

    if (!pagoExistente) {
      console.warn(`⚠️ Pago no encontrado en BD: ${paymentInfo.id}`);
      const nuevoPago = emFork.create(Pago, {
        fechaHora: new Date(),
        idMercadoPago: paymentInfo.id.toString(),
        idPreferencia: paymentInfo.id_preference,
        descripcionPago: paymentInfo.description,
        monto: paymentInfo.transaction_details?.net_received_amount,
        estado: paymentInfo.status as EstadoPago,
        detalleEstado: paymentInfo.status_detail,
        cuotas: paymentInfo.installments,
        fechaActualizacion: new Date(),
        metodoPago: paymentInfo.payment_method_id,
        tipoPago: paymentInfo.payment_type_id,
        emailPagador: paymentInfo.payer?.email,
        montoNeto: paymentInfo.transaction_details?.net_received_amount,
        fechaAprobacion: paymentInfo.date_approved
          ? new Date(paymentInfo.date_approved)
          : null,
        datosCompletos: paymentInfo,
        turno: paymentInfo.turno,
      });

      await emFork.persistAndFlush(nuevoPago);
      return;
    }

    // Guardar estado anterior para logging
    const estadoAnterior = pagoExistente.estado;

    // Actualizar campos del pago
    pagoExistente.estado = paymentInfo.status as EstadoPago;
    pagoExistente.detalleEstado = paymentInfo.status_detail;
    pagoExistente.fechaActualizacion = new Date();

    // Campos opcionales si están disponibles
    if (paymentInfo.date_approved) {
      pagoExistente.fechaAprobacion = new Date(paymentInfo.date_approved);
    }

    if (paymentInfo.payment_method_id) {
      pagoExistente.metodoPago = paymentInfo.payment_method_id;
    }

    if (paymentInfo.payment_type_id) {
      pagoExistente.tipoPago = paymentInfo.payment_type_id;
    }

    if (paymentInfo.payer?.email) {
      pagoExistente.emailPagador = paymentInfo.payer.email;
    }

    if (paymentInfo.transaction_details?.net_received_amount) {
      pagoExistente.montoNeto =
        paymentInfo.transaction_details.net_received_amount;
    }

    // Guardar datos completos para debugging/auditoría
    pagoExistente.datosCompletos = paymentInfo;

    await emFork.persistAndFlush(pagoExistente);

    console.log(
      `🔄 Pago ${pagoExistente.id} actualizado: ${estadoAnterior} → ${paymentInfo.status}`
    );

    // Ejecutar acciones según el nuevo estado
    await ejecutarAccionesPorEstado(
      pagoExistente,
      estadoAnterior,
      paymentInfo.status
    );
  } catch (error) {
    console.error('❌ Error actualizando pago en BD:', error);
    throw error;
  }
}

// Función para ejecutar acciones específicas según cambio de estado
async function ejecutarAccionesPorEstado(
  pago: Pago,
  estadoAnterior: EstadoPago,
  nuevoEstado: EstadoPago
) {
  if (estadoAnterior === nuevoEstado) {
    return;
  }

  try {
    switch (nuevoEstado) {
      case EstadoPago.APPROVED:
        console.log(
          `✅ Pago APROBADO - ID: ${pago.id}, Turno: ${pago.turno.id}`
        );
        // - Enviar email de confirmación

        break;

      case EstadoPago.REJECTED:
        console.log(
          `❌ Pago RECHAZADO - ID: ${pago.id}, Turno: ${pago.turno.id}`
        );

        // - Enviar email sugiriendo otro método de pago

        break;

      case EstadoPago.CANCELLED:
        console.log(`🚫 Pago CANCELADO - ID: ${pago.id}`);

        // - Notificar cancelación

        break;

      case EstadoPago.PENDING:
        console.log(`⏳ Pago PENDIENTE - ID: ${pago.id}`);

        // enviar email de recordatorio
        break;

      default:
        console.log(`ℹ️ Estado no manejado: ${nuevoEstado} - Pago: ${pago.id}`);
    }
  } catch (error) {
    console.error('❌ Error ejecutando acciones por estado:', error);
  }
}

// Función auxiliar para verificar el estado de un pago manualmente
async function verificarEstadoPago(req: Request, res: Response) {
  try {
    const { idMercadoPago } = req.params;

    // Consultar directamente a MercadoPago
    const paymentInfo = await payment.get({ id: idMercadoPago });

    // Actualizar en nuestra BD
    await actualizarPagoDesdeWebhook(paymentInfo);

    res.status(200).json({
      message: 'Estado verificado y actualizado',
      data: {
        id: paymentInfo.id,
        status: paymentInfo.status,
        status_detail: paymentInfo.status_detail,
      },
    });
  } catch (error: any) {
    console.error('Error verificando estado:', error);
    res.status(500).json({ error: error.message });
  }
}

export { mercadoPagoWebhook, verificarEstadoPago };
