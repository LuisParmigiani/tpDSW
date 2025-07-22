import { Request, Response, NextFunction } from 'express';
import { Turno } from './turno.entity.js';
import { orm } from '../shared/db/orm.js';

const em = orm.em;
function sanitizeTurnoInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizeTurnoInput = {
    fechaHora: req.body.fechaHora,
    estado: req.body.estado,
    calificacion: req.body.calificacion,
    comentario: req.body.comentario,
    montoFinal: req.body.montoFinal,
    fechaPago: req.body.fechaPago,
    servicio: req.body.servicio,
    usuario: req.body.usuario,
  };
  Object.keys(req.body.sanitizeTurnoInput).forEach((key) => {
    if (req.body.sanitizeTurnoInput[key] === undefined) {
      delete req.body.sanitizeTurnoInput[key];
    }
  });
  next();
}

// Find all turns
async function findall(req: Request, res: Response) {
  try {
    const turns = await em.find(
      Turno,
      {},
      { populate: ['usuario', 'servicio'] }
    );
    res.status(200).json({ message: 'found all turns', data: turns });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// Find one turn by date and hour
async function findone(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const turn = await em.findOne(
      Turno,
      { id },
      { populate: ['usuario', 'servicio'] }
    );
    if (!turn) {
      return res.status(404).json({ message: 'Turn not found' });
    }
    res.status(200).json({ message: 'found turn', data: turn });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// Create a new turn
async function add(req: Request, res: Response) {
  try {
    const sanitizedInput = req.body.sanitizeTurnoInput;
    const newTurn = em.create(Turno, sanitizedInput);
    await em.persistAndFlush(newTurn);
    res
      .status(201)
      .json({ message: 'Turn created successfully', data: newTurn });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// Update an existing turn
async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const sanitizedInput = req.body.sanitizeTurnoInput;
    const turn = await em.findOne(
      Turno,
      {
        id,
      },
      { populate: ['usuario', 'servicio'] }
    );

    if (!turn) {
      return res.status(404).json({ message: 'Turn not found' });
    }
    em.assign(turn, sanitizedInput);
    await em.persistAndFlush(turn);
    res.status(200).json({ message: 'Turn updated successfully', data: turn });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// Delete a turn
async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const turn = await em.findOne(
      Turno,
      { id },
      { populate: ['usuario', 'servicio'] }
    );
    if (!turn) {
      return res.status(404).json({ message: 'Turn not found' });
    }
    await em.removeAndFlush(turn);
    res.status(200).json({ message: 'Turn deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function getTurnosByServicioIdHelper(servicioId: number) {
  try {
    const turnos = await em.find(
      Turno,
      { servicio: { id: servicioId }, estado: 'completado' },
      { populate: ['usuario'] }
    );
    return turnos;
  } catch (error) {
    throw error;
  }
}

export {
  sanitizeTurnoInput,
  findall,
  findone,
  add,
  update,
  remove,
  getTurnosByServicioIdHelper,
};
