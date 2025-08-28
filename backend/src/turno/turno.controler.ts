import { Request, Response, NextFunction } from 'express';
import { Turno } from './turno.entity.js';
import { orm } from '../shared/db/orm.js';

interface AuthRequest extends Request {
  user?: {
    id: string;
    rol: string;
  };
}
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
async function addWithCookie(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const id = req.user.id;
    const sanitizedInput = req.body.sanitizeTurnoInput;
    sanitizedInput.usuario = id; // Asignar el ID del usuario autenticado
    const newTurn = em.create(Turno, sanitizedInput);
    await em.persistAndFlush(newTurn);
    res
      .status(201)
      .json({ message: 'Turn created successfully', data: newTurn });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

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
async function getTurnosByUserId(req: AuthRequest, res: Response) {
  const userId = Number(req.user?.id); // ID del usuario autenticado que viene de la cookie
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
      calificacionFilter = {
        estado: 'completado',
      };
      break;
    case 'porPagar':
      calificacionFilter = {
        estado: 'completado',
        pagos: { $none: { estado: { $in: ['approved', 'pending'] } } },
      };
      break;
    case 'pagado':
      calificacionFilter = {
        estado: 'completado',
        pagos: { $some: { estado: { $eq: 'approved' } } },
      };
      break;
    case 'pagoPendiente':
      calificacionFilter = {
        estado: 'completado',
        pagos: { $some: { estado: 'pending' } },
      };
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
      populate: [
        'servicio.tarea.tipoServicio',
        'servicio.usuario',
        'usuario',
        'pagos',
      ],
      limit: cantItemsPerPage,
      offset: (currentPage - 1) * cantItemsPerPage,
      orderBy: [selectedValueOrderShow],
    });

    // Agregar el campo hasPagoAprobado a cada turno (corrigiendo espacios y mayúsculas)
    const turnosConPagoAprobado = turnos.map((turno: any) => {
      // Si pagos es una colección, conviértelo a array
      const pagosArray = Array.isArray(turno.pagos)
        ? turno.pagos
        : turno.pagos?.toArray
        ? turno.pagos.toArray()
        : [];
      return {
        ...turno,
        hayPagoAprobado: pagosArray.some(
          (pago: any) =>
            typeof pago.estado === 'string' &&
            pago.estado.trim().toLowerCase() === 'approved'
        ),
      };
    });

    res.status(200).json({
      message: 'found turns by user id',
      data: turnosConPagoAprobado,
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
    const average = comments.length > 0 ? totalStars / comments.length : 0;
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
  console.log(date);
  try {
    const start = new Date(date + 'T00:00:00');

    const end = new Date(date + 'T23:59:59.999Z');

    const id = Number.parseInt(userId);
    const turnos = await em.find(
      Turno,
      {
        servicio: { usuario: { id: id } },
        fechaHora: {
          $gte: start, // Inicio del rango
          $lte: end, // Fin del rango
        },
        estado: { $ne: 'cancelado' },
      },
      { populate: ['servicio.tarea'] }
    );
    res.status(200).json({ message: 'found turns for user', data: turnos });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// Nueva función para obtener turnos como PRESTATARIO (quien ofrece servicios)
async function getTurnosByPrestadorId(req: Request, res: Response) {
  const prestadorId = Number.parseInt(req.params.id);
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
      calificacionFilter = {
        estado: 'completado',
      };
      break;
    case 'porPagar':
      calificacionFilter = {
        estado: 'completado',
        $and: [
          {
            pagos: { $none: { estado: 'aprobado' } },
          },
          {
            pagos: { $none: { estado: 'pendiente' } },
          },
        ],
      };
      break;
    case 'pagado':
      calificacionFilter = {
        estado: 'completado',
        pagos: { $some: { estado: 'aprobado' } },
      };
      break;
    case 'pagoPendiente':
      calificacionFilter = {
        estado: 'completado',
        pagos: { $some: { estado: 'pendiente' } },
      };
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

  // Buscar turnos donde el PRESTATARIO (servicio.usuario) es el prestadorId
  const where = {
    servicio: { usuario: { id: prestadorId } },
    ...calificacionFilter,
  };

  try {
    // Total de turnos para el paginado
    const totalCount = await em.count(Turno, where);

    // Buscar los turnos del prestatario
    const turnos = await em.find(Turno, where, {
      populate: [
        'servicio.tarea.tipoServicio',
        'servicio.usuario',
        'usuario',
        'pagos',
      ],
      limit: cantItemsPerPage,
      offset: (currentPage - 1) * cantItemsPerPage,
      orderBy: [selectedValueOrderShow],
    });

    const hayPagoAprobado = turnos.some(
      (turno) =>
        turno.pagos &&
        turno.pagos.toArray().some((pago: any) => pago.estado === 'aprobado')
    );

    res.status(200).json({
      message: 'found turns by prestador id',
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

export {
  sanitizeTurnoInput,
  findall,
  findone,
  add,
  update,
  remove,
  getTurnosByServicioIdHelper,
  getTurnosByUserId,
  getTurnosByPrestadorId,
  getTurnsPerDay,
  addWithCookie,
};
