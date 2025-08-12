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

// Get turns by user ID
async function getTurnosByUserId(req: Request, res: Response) {
  const userId = Number.parseInt(req.params.id);
  const cantItemsPerPage = Number(req.params.cantItemsPerPage) || 10;
  const currentPage = Number(req.params.currentPage) || 1;
  const selectedValueShow = req.params.selectedValueShow || '';
  const selectedValueOrder = req.params.selectedValueOrder || '';

  // Determinar el filtro de calificación según selectedValueShow
  let calificacionFilter: any = {};
  switch (selectedValueShow) {
    case 'faltanCalificar':
      calificacionFilter = { calificacion: null, estado: 'completado' };
      break;
    case 'calificados':
      calificacionFilter = { calificacion: { $ne: null } };
      break;
    case 'cancelados':
      calificacionFilter = { estado: 'cancelado' };
      break;
    case 'pendientes':
      calificacionFilter = { estado: 'pendiente' };
      break;
    case 'completado':
      calificacionFilter = { estado: 'completado' };
      break;
  }
  let selectedValueOrderShow;
  switch (selectedValueOrder) {
    case 'fechaA':
      selectedValueOrderShow = { fechaHora: 1 };
      break;
    case 'calificacionM':
      selectedValueOrderShow = { fechaHora: -1 };
      break;
    case 'calificacionB':
      selectedValueOrderShow = { calificacion: -1 };
      break;
    case 'calificacionP':
      selectedValueOrderShow = { calificacion: 1 };
      break;
    default:
      selectedValueOrderShow = { fechaHora: -1 };
  }

  // estructura para poder filtrar
  const where = {
    usuario: { id: userId },
    ...calificacionFilter,
  };
  try {
    // Total de turnos para ver el paginado
    const totalCount = await em.count(Turno, where);

    // Buscar los turnos del usuario, populando toda la información necesaria en una sola consulta
    const turnos = await em.find(Turno, where, {
      populate: ['servicio.tarea', 'servicio.usuario', 'usuario'],
      limit: cantItemsPerPage,
      offset: (currentPage - 1) * cantItemsPerPage,
      orderBy: selectedValueOrderShow,
    });

    res.status(200).json({
      message: 'found turns by user id',
      data: turnos,
      pagination: {
        totalPages: Math.ceil(totalCount / cantItemsPerPage),
        currentPage: currentPage,
        totalItems: totalCount,
        itemsPerPage: cantItemsPerPage,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function getTurnosByServicioIdHelper(params: {
  idServices: number[];
  maxItems: number;
  page: number;
  orderBy?: any;
}) {
  try {
    const { idServices, maxItems, page, orderBy } = params;
    const offset = (page - 1) * maxItems;

    // Configurar el orden basado en el parámetro orderBy
    let orderByClause;
    switch (orderBy) {
      case 'new':
        orderByClause = { fechaHora: -1 };
        break;
      case 'old':
        orderByClause = { fechaHora: 1 };
        break;
      case 'best':
        orderByClause = { calificacion: -1 };
        break;
      case 'worst':
        orderByClause = { calificacion: 1 };
        break;
      default:
        orderByClause = { fechaHora: -1 };
    }

    // Obtener los comentarios paginados
    const [comments, total] = await em.findAndCount(
      Turno,
      {
        servicio: { id: { $in: idServices } },
        estado: 'completado',
        calificacion: { $ne: null },
      },
      {
        populate: ['usuario', 'servicio'],
        limit: maxItems,
        offset,
        orderBy: orderByClause,
      }
    );
    let totalStars = 0;
    // Calcular el promedio de estrellas
    comments.forEach((comment) => {
      totalStars += comment.calificacion || 0;
    });
    const average = totalStars / total || 0;
    return {
      comments,
      totalComments: total,
      totalPages: Math.ceil(total / maxItems),
      average: average,
    };
  } catch (error) {
    throw error;
  }
}

async function getTurnsPerDay(req: Request, res: Response) {
  const userId = req.params.id; // ID del usuario
  const date = req.params.date; // fecha seleccionada para hacer la búsqueda

  try {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    // Usar MikroORM con sintaxis SQL estándar compatible con MySQL
    const id = Number.parseInt(userId);
    const turnos = await em.find(
      Turno,
      {
        servicio: { usuario: { id: id } },
        fechaHora: {
          $gte: start, // Inicio del rango
          $lte: end, // Fin del rango
        },
      },
      { populate: ['servicio.tarea'] }
    );
    res.status(200).json({ message: 'found turns for user', data: turnos });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
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
  getTurnosByUserId,
  getTurnsPerDay,
};
