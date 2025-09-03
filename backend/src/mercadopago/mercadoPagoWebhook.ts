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

// ⭐ WEBHOOK MEJORADO
async function mercadoPagoWebhook(req: Request, res: Response) {
  console.log('🔔 Webhook recibido:', req.body);
  console.log('🔔 Headers:', req.headers);

  try {
    const { type, data } = req.body;

    // Verificar que es una notificación de pago
    if (type === 'payment') {
      const paymentId = data.id;
      console.log(`📥 Procesando pago ID: ${paymentId}`);

      // Obtener información completa del pago
      const paymentInfo = await payment.get({ id: paymentId });
      console.log(
        '💰 Información completa del pago:',
        JSON.stringify(paymentInfo, null, 2)
      );

      // Actualizar el pago en BD
      await actualizarPagoDesdeWebhook(paymentInfo);

      // ⭐ SI EL PAGO FUE APROBADO, PROCESAR SPLIT
      if (paymentInfo.status === 'approved') {
        console.log('✅ Pago aprobado, iniciando proceso de split...');

        // Esperar un poco para asegurar que el dinero esté disponible
        setTimeout(async () => {
          try {
            await procesarSplitManual(paymentInfo);
          } catch (splitError) {
            console.error('❌ Error en split diferido:', splitError);
          }
        }, 5000); // 5 segundos de delay
      }

      console.log(`✅ Pago ${paymentId} procesado exitosamente`);
    } else {
      console.log(`ℹ️ Tipo de notificación no manejada: ${type}`);
    }

    // SIEMPRE responder 200 OK
    res.status(200).json({
      received: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('❌ Error procesando webhook:', error);

    // ⭐ IMPORTANTE: Aún así responder 200 para evitar reenvíos
    res.status(200).json({
      received: true,
      error: 'Processed with errors',
      timestamp: new Date().toISOString(),
    });
  }
}

// ⭐ FUNCIÓN MEJORADA PARA SPLIT MANUAL
async function procesarSplitManual(paymentInfo: any) {
  console.log('🔄 Procesando split manual para pago:', paymentInfo.id);

  try {
    const metadata = paymentInfo.metadata;

    if (!metadata) {
      console.log('⚠️ No hay metadata en el pago');
      return;
    }

    const vendorAccessToken = metadata.vendor_access_token;
    const vendorAmount = Number(metadata.vendor_amount);
    const marketplaceFee = Number(metadata.split_fee);
    const turnoId = metadata.turno_id;
    const vendorUserId = metadata.vendor_user_id;

    console.log('🔄 Datos para split:', {
      payment_id: paymentInfo.id,
      total: paymentInfo.transaction_amount,
      marketplace_fee: marketplaceFee,
      vendor_amount: vendorAmount,
      vendor_user_id: vendorUserId,
      has_vendor_token: !!vendorAccessToken,
    });

    if (!vendorAccessToken || !vendorAmount || vendorAmount <= 0) {
      console.log('⚠️ Faltan datos para el split');
      await guardarRegistroSplit(
        paymentInfo,
        null,
        'failed',
        'Datos incompletos'
      );
      return;
    }

    // ⭐ MÉTODO 1: Money Transfer (Preferido)
    console.log('💸 Intentando Money Transfer...');

    const transferResult = await crearMoneyTransfer({
      amount: vendorAmount,
      receiverAccessToken: vendorAccessToken,
      description: `Split pago ${paymentInfo.id} - Turno ${turnoId}`,
      paymentId: paymentInfo.id,
    });

    if (transferResult.success) {
      console.log('✅ Money Transfer exitoso:', transferResult.data);
      await guardarRegistroSplit(paymentInfo, transferResult.data, 'completed');
      return transferResult.data;
    }

    // ⭐ MÉTODO 2: Si falla, intentar con API directa
    console.log('💰 Money Transfer falló, intentando API directa...');

    const directTransferResult = await crearTransferenciaDirecta({
      amount: vendorAmount,
      vendorUserId: vendorUserId,
      paymentId: paymentInfo.id,
      turnoId: turnoId,
    });

    if (directTransferResult.success) {
      console.log(
        '✅ Transferencia directa exitosa:',
        directTransferResult.data
      );
      await guardarRegistroSplit(
        paymentInfo,
        directTransferResult.data,
        'completed'
      );
      return directTransferResult.data;
    }

    throw new Error('Todos los métodos de transferencia fallaron');
  } catch (error: any) {
    console.error('❌ Error en split manual:', error);
    await guardarRegistroSplit(paymentInfo, null, 'failed', error.message);
    throw error;
  }
}

// ⭐ MÉTODO 1: Money Transfer usando SDK
async function crearMoneyTransfer(params: {
  amount: number;
  receiverAccessToken: string;
  description: string;
  paymentId: string;
}) {
  try {
    // Crear cliente con token del vendedor
    const vendorClient = new MercadoPagoConfig({
      accessToken: params.receiverAccessToken,
    });

    // Usar API de Money Transfer
    const transferResponse = await fetch(
      'https://api.mercadopago.com/v1/money_transfers',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`, // TU token como marketplace
          'Content-Type': 'application/json',
          'X-Idempotency-Key': `split_${params.paymentId}_${Date.now()}`,
        },
        body: JSON.stringify({
          amount: params.amount,
          currency_id: 'ARS',
          description: params.description,
          receiver_id: params.receiverAccessToken, // Token del vendedor
          external_reference: `split_${params.paymentId}`,
        }),
      }
    );

    if (transferResponse.ok) {
      const data = await transferResponse.json();
      return { success: true, data };
    } else {
      const errorText = await transferResponse.text();
      console.error(
        '❌ Error en Money Transfer:',
        transferResponse.status,
        errorText
      );
      return { success: false, error: errorText };
    }
  } catch (error: any) {
    console.error('❌ Error creando Money Transfer:', error);
    return { success: false, error: error.message };
  }
}

// ⭐ MÉTODO 2: Transferencia directa por User ID
async function crearTransferenciaDirecta(params: {
  amount: number;
  vendorUserId: string;
  paymentId: string;
  turnoId: string;
}) {
  try {
    console.log(
      '🔄 Creando transferencia directa a user ID:',
      params.vendorUserId
    );

    const transferResponse = await fetch(
      'https://api.mercadopago.com/money_transfers',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': `direct_${params.paymentId}_${Date.now()}`,
        },
        body: JSON.stringify({
          amount: params.amount,
          currency: 'ARS',
          receiver_id: parseInt(params.vendorUserId), // ID numérico del usuario
          description: `Split directo - Pago ${params.paymentId}`,
          external_reference: `direct_split_${params.paymentId}`,
          metadata: {
            original_payment_id: params.paymentId,
            turno_id: params.turnoId,
            transfer_method: 'direct_user_id',
          },
        }),
      }
    );

    if (transferResponse.ok) {
      const data = await transferResponse.json();
      return { success: true, data };
    } else {
      const errorText = await transferResponse.text();
      console.error(
        '❌ Error transferencia directa:',
        transferResponse.status,
        errorText
      );
      return { success: false, error: errorText };
    }
  } catch (error: any) {
    console.error('❌ Error en transferencia directa:', error);
    return { success: false, error: error.message };
  }
}

// ⭐ FUNCIÓN MEJORADA PARA GUARDAR REGISTROS
async function guardarRegistroSplit(
  paymentInfo: any,
  transferResult: any,
  status: string,
  error?: string
) {
  try {
    const splitRecord = {
      payment_id: paymentInfo.id,
      total_amount: paymentInfo.transaction_amount,
      marketplace_fee: paymentInfo.metadata?.split_fee,
      vendor_amount: paymentInfo.metadata?.vendor_amount,
      vendor_id: paymentInfo.metadata?.prestatario_id,
      turno_id: paymentInfo.metadata?.turno_id,
      transfer_id: transferResult?.id || null,
      transfer_method: transferResult?.method || 'unknown',
      status: status,
      error_message: error,
      raw_transfer_data: transferResult,
      raw_payment_data: paymentInfo.metadata,
      created_at: new Date(),
      updated_at: new Date(),
    };

    console.log('📝 Guardando registro de split:', splitRecord);

    // Aquí implementa el guardado en tu BD
    // const emFork = em.fork();
    // const splitEntity = emFork.create(SplitPaymentEntity, splitRecord);
    // await emFork.persistAndFlush(splitEntity);
  } catch (error: any) {
    console.error('❌ Error guardando registro split:', error);
  }
}

// ... resto de las funciones (actualizarPagoDesdeWebhook, etc.) ...
async function actualizarPagoDesdeWebhook(paymentInfo: any) {
  const emFork = em.fork();

  try {
    const pagoExistente = await emFork.findOne(
      Pago,
      { idMercadoPago: paymentInfo.id.toString() },
      { populate: ['turno'] }
    );

    if (!pagoExistente) {
      console.warn(`⚠️ Pago no encontrado en BD: ${paymentInfo.id}`);
      const idTurno = paymentInfo.external_reference;
      const nuevoPago = emFork.create(Pago, {
        fechaHora: new Date(),
        idMercadoPago: paymentInfo.id.toString(),
        idPreferencia: paymentInfo.preference_id,
        descripcionPago: paymentInfo.description,
        monto: paymentInfo.transaction_amount,
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

    // Actualizar pago existente
    const estadoAnterior = pagoExistente.estado;
    pagoExistente.estado = paymentInfo.status as EstadoPago;
    pagoExistente.detalleEstado = paymentInfo.status_detail;
    pagoExistente.fechaActualizacion = new Date();
    pagoExistente.datosCompletos = paymentInfo;

    if (paymentInfo.date_approved) {
      pagoExistente.fechaAprobacion = new Date(paymentInfo.date_approved);
    }

    await emFork.persistAndFlush(pagoExistente);

    console.log(
      `🔄 Pago ${pagoExistente.id} actualizado: ${estadoAnterior} → ${paymentInfo.status}`
    );
  } catch (error) {
    console.error('❌ Error actualizando pago en BD:', error);
    throw error;
  }
}

async function verificarEstadoPago(req: Request, res: Response) {
  try {
    const { idMercadoPago } = req.params;
    const paymentInfo = await payment.get({ id: idMercadoPago });
    await actualizarPagoDesdeWebhook(paymentInfo);

    res.status(200).json({
      message: 'Estado verificado y actualizado',
      data: {
        id: paymentInfo.id,
        status: paymentInfo.status,
        status_detail: paymentInfo.status_detail,
        transaction_amount: paymentInfo.transaction_amount,
        metadata: paymentInfo.metadata,
      },
    });
  } catch (error: any) {
    console.error('Error verificando estado:', error);
    res.status(500).json({ error: error.message });
  }
}

export { mercadoPagoWebhook, verificarEstadoPago };
