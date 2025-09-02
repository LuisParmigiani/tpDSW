import { Request, Response } from 'express';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { Pago, EstadoPago } from '../pago/pago.entity.js';
import { orm } from '../shared/db/orm.js';
const em = orm.em;

// Configurar MercadoPago
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

const payment = new Payment(client);

// Webhook para recibir notificaciones de MercadoPago
async function mercadoPagoWebhook(req: Request, res: Response) {
  console.log('🔔 Webhook recibido:', req.body);
  try {
    console.log('🔔 Webhook en el try ');
    const { type, data } = req.body;

    // Verificar que es una notificación de pago
    if (type === 'payment') {
      const paymentId = data.id;

      console.log(`📥 Procesando pago ID: ${paymentId}`);

      // Obtener información completa del pago desde MercadoPago
      const paymentInfo = await payment.get({ id: paymentId });
      console.log('💰 Información del pago:', paymentInfo);
      console.log('📊 Metadata del pago:', paymentInfo.metadata);
      // Actualizar el pago en nuestra base de datos
      await actualizarPagoDesdeWebhook(paymentInfo);

      if (paymentInfo.status === 'approved') {
        console.log('✅ Pago aprobado, iniciando split payment...');
        await procesarSplitPayment(paymentInfo);
      }
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

// NUEVA FUNCIÓN: Procesar Split Payment
async function procesarSplitPayment(paymentInfo: any) {
  console.log('🔔 Webhook en el procesarSplitPayment:', paymentInfo);
  try {
    const metadata = paymentInfo.metadata;

    // 📊 OBTENER INFORMACIÓN DEL SPLIT DESDE METADATA
    const vendorAccessToken = metadata?.vendor_access_token; // 👤 TOKEN DEL VENDEDOR
    const vendorAmount = metadata?.vendor_amount; // 👤 95% para el vendedor
    const marketplaceFee = metadata?.split_fee; // 🏢 5% para ti
    const vendorEmail = metadata?.vendor_email;
    const turnoId = metadata?.turno_id;

    console.log('🔄 Datos para split payment:', {
      total: paymentInfo.transaction_amount,
      marketplace_fee: marketplaceFee, // 🏢 TU PARTE (ya la tienes automáticamente)
      vendor_amount: vendorAmount, // 👤 PARTE DEL VENDEDOR
      vendor_email: vendorEmail,
      has_vendor_token: !!vendorAccessToken,
    });

    if (!vendorAccessToken || !vendorAmount || vendorAmount <= 0) {
      console.log(
        '⚠️ No se puede procesar split: falta token del vendedor o monto inválido'
      );
      return;
    }

    try {
      console.log('💸 Iniciando transferencia al vendedor...');

      // Opción 1: Money Request (Transferencia directa)
      const transferResponse = await fetch(
        'https://api.mercadopago.com/money_requests',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${vendorAccessToken}`, // 👤 TOKEN DEL VENDEDOR
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: Number(vendorAmount), // 👤 95% del pago
            currency: 'ARS',
            email: vendorEmail, // 👤 EMAIL DEL VENDEDOR
            concept: `Pago por servicio - Turno ${turnoId}`,
            external_reference: `split_${paymentInfo.id}`,
          }),
        }
      );

      if (!transferResponse.ok) {
        const errorData = await transferResponse.text();
        console.error(
          '❌ Error en transferencia:',
          transferResponse.status,
          errorData
        );

        // Intentar método alternativo: Payout
        await intentarPayout(
          vendorAccessToken,
          vendorAmount,
          vendorEmail,
          paymentInfo.id,
          turnoId
        );
      } else {
        const transferResult = await transferResponse.json();
        console.log('✅ Transferencia al vendedor exitosa:', transferResult);

        // 📝 GUARDAR REGISTRO EN BASE DE DATOS
        await guardarRegistroSplit(paymentInfo, transferResult, 'completed');
      }
    } catch (transferError: any) {
      console.error('❌ Error en transferencia principal:', transferError);

      // Intentar método de respaldo
      await intentarPayout(
        vendorAccessToken,
        vendorAmount,
        vendorEmail,
        paymentInfo.id,
        turnoId
      );
    }
  } catch (error: any) {
    console.error('❌ Error procesando split payment:', error);
    await guardarRegistroSplit(paymentInfo, null, 'failed', error.message);
  }
}

// 💰 MÉTODO ALTERNATIVO: Payout (transferencia bancaria)
async function intentarPayout(
  vendorToken: string,
  amount: number,
  email: string,
  paymentId: string,
  turnoId: string
) {
  try {
    console.log('💰 Intentando payout como método alternativo...');

    const payoutResponse = await fetch('https://api.mercadopago.com/payouts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${vendorToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Number(amount),
        currency: 'ARS',
        receiver: {
          type: 'email',
          value: email,
        },
        concept: `Split payment - Turno ${turnoId}`,
        external_reference: `payout_${paymentId}`,
      }),
    });

    if (payoutResponse.ok) {
      const payoutResult = await payoutResponse.json();
      console.log('✅ Payout exitoso:', payoutResult);
      return payoutResult;
    } else {
      const errorData = await payoutResponse.text();
      console.error('❌ Error en payout:', payoutResponse.status, errorData);
      throw new Error(`Payout failed: ${errorData}`);
    }
  } catch (error: any) {
    console.error('❌ Error en payout alternativo:', error);
    throw error;
  }
}

async function guardarRegistroSplit(
  paymentInfo: any,
  transferResult: any,
  status: string,
  error?: string
) {
  try {
    // Aquí deberías implementar el guardado en tu base de datos
    console.log('📝 Guardando registro de split payment:', {
      payment_id: paymentInfo.id,
      total_amount: paymentInfo.transaction_amount,
      marketplace_fee: paymentInfo.metadata?.split_fee,
      vendor_amount: paymentInfo.metadata?.vendor_amount,
      vendor_id: paymentInfo.metadata?.prestatario_id,
      turno_id: paymentInfo.metadata?.turno_id,
      transfer_id: transferResult?.id,
      status: status,
      error: error,
      created_at: new Date(),
    });

    // Ejemplo de implementación con tu ORM:
    /*
    const emFork = em.fork();
    const splitRecord = emFork.create(SplitPayment, {
      payment_id: paymentInfo.id,
      total_amount: paymentInfo.transaction_amount,
      marketplace_fee: paymentInfo.metadata?.split_fee,
      vendor_amount: paymentInfo.metadata?.vendor_amount,
      vendor_id: paymentInfo.metadata?.prestatario_id,
      turno_id: paymentInfo.metadata?.turno_id,
      transfer_id: transferResult?.id,
      status: status,
      error: error,
    });
    await emFork.persistAndFlush(splitRecord);
    */
  } catch (error: any) {
    console.error('❌ Error guardando registro split:', error);
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
      const idTurno = paymentInfo.external_reference;
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
        turno: idTurno,
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
