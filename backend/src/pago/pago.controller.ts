import { Request, Response, NextFunction } from 'express';
import { Pago, EstadoPago } from './pago.entity.js';
import { orm } from '../shared/db/orm.js';

const em = orm.em;

function sanitizePagoInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizePagoInput = {
    fechaHora: req.body.fechaHora,
    idMercadoPago: req.body.idMercadoPago,
    idPreferencia: req.body.idPreferencia,
    descripcionPago: req.body.descripcionPago,
    monto: req.body.monto,
    estado: req.body.estado,
    detalleEstado: req.body.detalleEstado,
    cuotas: req.body.cuotas,
    fechaActualizacion: req.body.fechaActualizacion,
    metodoPago: req.body.metodoPago,
    tipoPago: req.body.tipoPago,
    emailPagador: req.body.emailPagador,
    montoNeto: req.body.montoNeto,
    fechaAprobacion: req.body.fechaAprobacion,
    datosCompletos: req.body.datosCompletos,
    turno: req.body.turno,
  };
  Object.keys(req.body.sanitizePagoInput).forEach((key) => {
    if (req.body.sanitizePagoInput[key] === undefined) {
      delete req.body.sanitizePagoInput[key];
    }
  });
  next();
}

async function findall(req: Request, res: Response) {
  try {
    const { estado, limit = 50, offset = 0 } = req.query;
    const whereConditions: any = {};
    if (estado) {
      whereConditions.estado = estado;
    }
    const [pagos, total] = await em.findAndCount(Pago, whereConditions, {
      populate: ['turno'],
      limit: Number(limit),
      offset: Number(offset),
      orderBy: { fechaHora: 'DESC' },
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
// Buscar por ID de MercadoPago
async function findByMercadoPagoId(req: Request, res: Response) {
  try {
    const { idMercadoPago } = req.params;
    const pago = await em.findOne(
      Pago,
      { idMercadoPago },
      { populate: ['turno'] }
    );
    if (!pago) {
      return res.status(404).json({
        message: 'Pago no encontrado',
        idMercadoPago,
      });
    }
    res.status(200).json({
      message: 'Pago encontrado:',
      data: {
        id: pago.id,
        idMercadoPago: pago.idMercadoPago,
        estado: pago.estado,
        detalleEstado: pago.detalleEstado,
        monto: pago.monto,
        descripcion: pago.descripcionPago,
        cuotas: pago.cuotas,
        fechaHora: pago.fechaHora,
        fechaActualizacion: pago.fechaActualizacion,
        fechaAprobacion: pago.fechaAprobacion,
        metodoPago: pago.metodoPago,
        tipoPago: pago.tipoPago,
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

async function add(req: Request, res: Response) {
  try {
    const sanitizedInput = req.body.sanitizePagoInput;
    // Validaciones básicas
    if (!sanitizedInput.idMercadoPago) {
      return res.status(400).json({ error: 'ID de MercadoPago es requerido' });
    }
    if (!sanitizedInput.turno) {
      return res.status(400).json({ error: 'Turno es requerido' });
    }
    // Verificar si ya existe un pago con este ID de MercadoPago
    const pagoExistente = await em.findOne(Pago, {
      idMercadoPago: sanitizedInput.idMercadoPago,
    });
    if (pagoExistente) {
      return res.status(409).json({
        error: 'Ya existe un pago con este ID de MercadoPago',
        pagoExistente: pagoExistente.id,
      });
    }
    // Establecer valores por defecto
    sanitizedInput.fechaHora = sanitizedInput.fechaHora || new Date();
    sanitizedInput.fechaActualizacion = new Date();
    sanitizedInput.estado = sanitizedInput.estado || EstadoPago.PENDING;
    sanitizedInput.cuotas = sanitizedInput.cuotas || 1;
    const newPago = em.create(Pago, sanitizedInput);
    await em.persistAndFlush(newPago);
    res.status(201).json({ message: 'Pago creado:', data: newPago });
  } catch (error: any) {
    console.error('Error creando pago:', error);
    res.status(500).json({ error: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const pago = await em.findOneOrFail(Pago, { id });
    // Actualizar fecha de actualización automáticamente
    req.body.sanitizePagoInput.fechaActualizacion = new Date();
    em.assign(pago, req.body.sanitizePagoInput);
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
  findByMercadoPagoId,
  findByTurno,
  add,
  update,
  remove,
  sanitizePagoInput,
};
