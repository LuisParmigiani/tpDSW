import { useEffect, useState } from 'react';
import { turnosApi } from '../../services/turnosApi';
import Navbar from '../Navbar/Navbar.tsx';
import Footer from '../Footer/Footer';
import PaginationControls from '../Pagination/PaginationControler';
import CustomSelect from '../Select/CustomSelect';
import CalificationModal from '../Modal/CalificationModal';
import { useNavigate } from 'react-router-dom';
import DevolucionPago from '../Modal/DevolucionPago.tsx';
import { useProtectRoute } from '../../cookie/useProtectRoute.tsx';
import TurnCard from './turnCard';
type Pago = {
  id: number;
  estado: string;
};

type Turno = {
  id: number;
  fechaHora: Date;
  montoFinal: number;
  servicio: Servicio;
  calificacion: number | null;
  comentario: string | null;
  estado: string;
  usuario: Usuario;
  pagos: Pago[];
  hayPagoAprobado?: boolean; // Nuevo campo para indicar si tiene pagos aprobados
};

type Servicio = {
  id: number;
  tarea: Tarea;
  usuario: Usuario;
};
type Tarea = {
  nombreTarea: string;
  descripcionTarea: string;
  duracionTarea: number;
  tipoServicio: {
    id: number;
    nombreTipo: string;
  };
};
type Usuario = {
  id: number;
  mail: string;
  nombreFantasia: string;
};

type Props = {
  estado?: string;
};

function TurnHistory({ estado }: Props) {
  const { usuario, loading: authLoading } = useProtectRoute(['cliente']);
  const [abrirDevolucion, setAbrirDevolucion] = useState(true);
  const navigate = useNavigate();
  const [turns, setTurns] = useState<Turno[] | null>(null); // Se guardan todos los turnos del usuario
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Modal para calificar
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<Turno | null>(null);
  // Variables para la calificacion
  const [startRating, setStartRating] = useState<number>(5);
  const [comentario, setComentario] = useState<string>('');
  // orden de los turnos
  const [selectedValueOrder, setSelectedValueOrder] = useState('');
  // Filtros de los turnos
  const [selectedValueShow, setSelectedValueShow] = useState('');
  // Variables de paginacion:
  const cantItemsPerPage = '9'; // Cantidad de turnos por pagina
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas

  // buscar todos los turnos del usuario con la informcaion del mismo.
  useEffect(() => {
    if (authLoading || !usuario) return;
    const turn = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await turnosApi.getByUserId(
          cantItemsPerPage,
          currentPage.toString(),
          selectedValueShow,
          selectedValueOrder
        );
        setTurns(res.data.data);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.totalPages); // Total de páginas
        }
      } catch (err) {
        console.error('Error al cargar turnos:', err);
        setError('Error al cargar los turnos. Por favor, intenta de nuevo.');
        // Resetear el estado en caso de error
        setTurns([]);
      } finally {
        setLoading(false);
      }
    };
    turn();
  }, [
    authLoading,
    usuario,
    currentPage,
    selectedValueShow,
    selectedValueOrder,
  ]);

  //modal para calificar
  const openModal = (modalData: Turno) => {
    setData(modalData); // Guardar los datos del turno seleccionado
    // Inicializar el formulario con valores por defecto
    setComentario(modalData.comentario || '');
    setIsOpen(true);
  };
  // Cerrar modal
  const closeModal = () => {
    setIsOpen(false);
    setData(null);
    // Resetear el formulario
    setStartRating(5);
    setComentario('');
  };

  // Guardar calificación
  const SaveRating = async () => {
    if (data) {
      const dataForUpdate = {
        calificacion: startRating,
        comentario: comentario,
      };
      try {
        const res = await turnosApi.update(data.id.toString(), dataForUpdate);
        console.log('Respuesta de la API:', res);

        // Actualizar el turno en la lista local en lugar de recargar toda la página
        if (turns) {
          const updatedTurns = turns.map((turn) =>
            turn.id === data.id
              ? { ...turn, calificacion: startRating, comentario: comentario }
              : turn
          );
          setTurns(updatedTurns);
        }

        // Resetear el formulario y cerrar modal
        setStartRating(5);
        setComentario('');
        closeModal();
      } catch (error) {
        console.error('Error al guardar la calificación:', error);
      }
    }
  };

  // Función para manejar el cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Efecto para manejar el cierre del modal y el scroll del body
  useEffect(() => {
    if (isOpen && data) {
      console.log('Modal abierto con datos:', data);
      document.body.style.overflow = 'hidden';
      // Para cerrar el modal con la tecla Escape
      const handleEsc = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          closeModal();
        }
      };
      document.addEventListener('keydown', handleEsc);

      return () => {
        document.removeEventListener('keydown', handleEsc);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, data]);

  // Cancelar turno
  const cancelarTurno = async (id: number) => {
    try {
      await turnosApi.update(id.toString(), {
        estado: 'cancelado',
      });
      // Actualizar el estado local de los turnos
      setTurns(turns ? turns.filter((turno) => turno.id !== id) : null);
    } catch (error) {
      console.error('Error al cancelar el turno:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Cargando...</p>
      </div>
    );
  }
  if (!usuario) {
    // No autorizado, no renderizar nada (la redirección ya se maneja en el hook)
    return null;
  }
  return (
    <>
      <Navbar />
      {estado && abrirDevolucion && (
        <DevolucionPago
          estado={estado}
          cerrar={() => setAbrirDevolucion(false)}
        />
      )}
      {isOpen && data && (
        <CalificationModal
          data={data}
          closeModal={closeModal}
          startRating={startRating}
          setStartRating={setStartRating}
          comentario={comentario}
          setComentario={setComentario}
          SaveRating={SaveRating}
        />
      )}

      <div className="text-black min-h-3/4">
        <h1 className="text-4xl font-bold mt-6">Historial de Turnos</h1>
        <div className="flex flex-row gap-4 lg:-mt-11  mt-3 pl-3 mb-8  ">
          <div>
            <CustomSelect
              Name="Ordenar por"
              options={[
                { value: 'todos', label: 'Mostrar Todos' },
                { value: 'fechaA', label: 'Fecha ascendente' },
                { value: 'fechaD', label: 'Fecha descendente' },
                { value: 'calificacionM', label: 'Mejor calificación' },
                { value: 'calificacionP', label: 'Peor calificación' },
              ]}
              setOptions={setSelectedValueOrder}
              setPage={setCurrentPage}
            />
          </div>
          <div>
            {' '}
            <CustomSelect
              Name="Mostrar"
              options={[
                { value: 'todos', label: 'Mostrar Todos' },
                { value: 'faltanCalificar', label: 'Faltan Calificar' },
                { value: 'calificados', label: 'Calificados' },
                { value: 'cancelados', label: 'Cancelados' },
                { value: 'pendientes', label: 'Pendientes' },
                { value: 'completado', label: 'Completado' },
                { value: 'porPagar', label: 'Por Pagar' },
                { value: 'pagado', label: 'Pagado' },
                { value: 'pagoPendiente', label: 'Pago Pendiente' },
              ]}
              setOptions={setSelectedValueShow}
              setPage={setCurrentPage}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <p>Cargando turnos...</p>
        ) : turns ? (
          turns.length > 0 ? (
            <ul className="flex flex-row flex-wrap items-center justify-center w-full m-auto ">
              {turns.map((turn) => (
                <TurnCard
                  key={turn.id}
                  navigate={navigate}
                  turn={turn}
                  openModal={openModal}
                  cancelarTurno={cancelarTurno}
                />
              ))}
            </ul>
          ) : (
            <p className="">
              No hay turnos para las características solicitadas.
            </p>
          )
        ) : null}

        {/* Controles de paginación */}
        <div className="flex justify-center">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      <Footer />
    </>
  );
}
export default TurnHistory;
