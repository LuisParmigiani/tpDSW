import { Request, Response, NextFunction } from 'express';
import { Pago } from './pago.entity.js';
import { orm } from '../shared/db/orm.js';

const em = orm.em;

async function findall(req: Request, res: Response) {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    const whereConditions: any = {};
    if (status) {
      whereConditions.estado = status; // Cambiado de "status" a "estado"
    }
    const [pagos, total] = await em.findAndCount(Pago, whereConditions, {
      populate: ['turno'],
      limit: Number(limit),
      offset: Number(offset),
      orderBy: { createdAt: 'DESC' },
    });
    res.status(200).json({
      message: 'Pagos encontrados:',
      data: pagos,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
// Buscar por Payment Intent ID de Stripe
async function findByPaymentIntentId(req: Request, res: Response) {
  try {
    const { paymentIntentId } = req.params;
    const pago = await em.findOne(
      Pago,
      { paymentIntentId },
      { populate: ['turno'] }
    );
    if (!pago) {
      return res.status(404).json({
        message: 'Pago no encontrado',
        paymentIntentId,
      });
    }
    res.status(200).json({
      message: 'Pago encontrado:',
      data: {
        id: pago.id,
        paymentIntentId: pago.paymentIntentId,
        estado: pago.estado,
        amount: pago.amount,
        currency: pago.currency,
        sellerStripeId: pago.sellerStripeId,
        amountReceived: pago.amountReceived,
        applicationFeeAmount: pago.applicationFeeAmount,
        transferId: pago.transferId,
        buyerEmail: pago.buyerEmail,
        createdAt: pago.createdAt,
        updatedAt: pago.updatedAt,
        turno: {
          id: pago.turno.id,
          // Agregar campos del turno que necesites
        },
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Buscar pago por turno
async function findByTurno(req: Request, res: Response) {
  try {
    const { turnoId } = req.params;
    const pago = await em.findOne(
      Pago,
      { turno: Number(turnoId) },
      { populate: ['turno'] }
    );
    if (!pago) {
      return res.status(404).json({
        message: 'No se encontró pago para este turno',
        turnoId,
      });
    }
    res.status(200).json({ message: 'Pago encontrado:', data: pago });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Buscar pagos por vendedor (cuenta de Stripe)
async function findBySeller(req: Request, res: Response) {
  try {
    const { sellerStripeId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    const [pagos, total] = await em.findAndCount(
      Pago,
      { sellerStripeId },
      {
        populate: ['turno'],
        limit: Number(limit),
        offset: Number(offset),
        orderBy: { createdAt: 'DESC' },
      }
    );
    res.status(200).json({
      message: 'Pagos encontrados para el vendedor:',
      data: pagos,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function findone(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const pago = await em.findOne(Pago, { id }, { populate: ['turno'] });
    if (!pago) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }
    res.status(200).json({ message: 'Pago encontrado:', data: pago });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updatePagoSplit(
  paymentIntentId: string,
  status: string,
  paymentIntent?: any
) {
  try {
    // Buscar si ya existe un pago con este Payment Intent ID
    const pagoExistente = await em.findOne(Pago, { paymentIntentId });

    if (pagoExistente) {
      // Actualizar pago existente
      pagoExistente.estado = status as any;
      pagoExistente.updatedAt = new Date();

      // Si tenemos datos del paymentIntent de Stripe, actualizar campos adicionales
      if (paymentIntent) {
        pagoExistente.buyerEmail =
          paymentIntent.receipt_email || pagoExistente.buyerEmail;
        pagoExistente.amountReceived =
          paymentIntent.amount_received || pagoExistente.amountReceived;
        pagoExistente.metadata =
          paymentIntent.metadata || pagoExistente.metadata;
      }

      await em.persistAndFlush(pagoExistente);
      return pagoExistente;
    } else {
      // Si no existe y tenemos datos completos, crear nuevo pago
      if (!paymentIntent) {
        throw new Error(
          'No se puede crear un pago sin datos del Payment Intent'
        );
      }
      const amountReceived =
        paymentIntent.amount - paymentIntent.application_fee_amount;
      const nuevoPago = em.create(Pago, {
        paymentIntentId,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        estado: status as any,
        sellerStripeId: paymentIntent.transfer_data.destination,
        amountReceived: amountReceived,
        applicationFeeAmount: paymentIntent.application_fee_amount,
        buyerEmail: paymentIntent.metadata.userMail,
        metadata: paymentIntent.metadata,
        transferId: paymentIntent.transfer,
        createdAt: new Date(),
        updatedAt: new Date(),
        // Nota: turno debe ser asignado externamente o extraído de metadata
        turno: Number(paymentIntent.metadata.turnoId),
      });

      await em.persistAndFlush(nuevoPago);
      return nuevoPago;
    }
  } catch (error) {
    console.error('Error actualizando/creando pago:', error);
    throw new Error('Error actualizando/creando pago');
  }
}

async function add(req: Request, res: Response) {
  try {
    const input = req.body;

    // Validar que el turno tiene fechaHora
    if (!input.turno || !input.turno.fechaHora) {
      return res.status(400).json({
        message: 'Validation error',
        errors: [
          {
            path: 'turno.fechaHora',
            message:
              'El campo fechaHora es obligatorio y debe ser un string válido',
          },
        ],
      });
    }

    // Verificar si ya existe un pago con este Payment Intent ID
    const pagoExistente = await em.findOne(Pago, {
      paymentIntentId: input.paymentIntentId,
    });
    if (pagoExistente) {
      return res.status(409).json({
        error: 'Ya existe un pago con este Payment Intent ID',
        pagoExistente: pagoExistente.id,
      });
    }

    input.createdAt = input.createdAt || new Date();
    input.updatedAt = new Date();
    input.estado = input.estado || 'pending';
    input.currency = input.currency || 'usd';

    const newPago = em.create(Pago, input);
    await em.persistAndFlush(newPago);

    res.status(201).json({ message: 'Pago creado:', data: newPago });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const pago = await em.findOneOrFail(Pago, { id });
    req.body.updatedAt = new Date(); // Actualiza automáticamente la fecha
    em.assign(pago, req.body); // Cambiado de req.body.sanitizePagoInput a req.body
    await em.persistAndFlush(pago);
    res.status(200).json({ message: 'Pago actualizado:', data: pago });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const pago = await em.findOneOrFail(Pago, { id });
    await em.removeAndFlush(pago);
    res.status(200).json({ message: 'Pago eliminado:', data: pago });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export {
  findall,
  findone,
  findByPaymentIntentId,
  findByTurno,
  findBySeller,
  updatePagoSplit,
  add,
  update,
  remove,
};
