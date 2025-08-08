import { useEffect, useState } from 'react';
import { turnosApi } from '../../services/turnosApi.js';
import Natbar from '../Navbar/Navbar.js';
import Footer from '../Footer/Footer';
import PaginationControls from '../Pagination/PaginationControler';
import CustomSelect from '../Select/CustomSelect';
import CalificationModal from '../Modal/CalificationModal';
import Stars from '../stars/Stars.js';

type Turno = {
  id: number;
  fechaHora: Date;
  montoFinal: number;
  servicio: servicio;
  calificacion: number | null;
  comentario: string | null;
  estado: string;
  usuario: Usuario;
};

type servicio = {
  id: number;
  nombre: string;
  tarea: Tarea;
  usuario: Usuario;
};
type Tarea = {
  nombreTarea: string;
  descripcionTarea: number;
  duracionTarea: number;
};
type Usuario = {
  id: number;
  mail: string;
  nombreFantasia: string;
};

function TurnHistory() {
  const id = 1; // aca el id del usuario
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
    const turn = async (id: number) => {
      setLoading(true);
      setError(null);
      try {
        const res = await turnosApi.getByUserId(
          id.toString(),
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
    if (id) {
      turn(id);
    }
  }, [id, currentPage, selectedValueShow, selectedValueOrder]);

  //modal para calificar
  const openModal = (modalData: Turno) => {
    setData(modalData); // Guardar los datos del turno seleccionado
    // Inicializar el formulario con valores por defecto
    setComentario(modalData.comentario || '');
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
    setData(null);
    // Resetear el formulario
    setStartRating(5);
    setComentario('');
  };
  const SaveRating = async () => {
    if (data) {
      // Mostrar la información capturada
      console.log('Datos del turno:', data);
      console.log('Calificación seleccionada:', startRating);
      console.log('Comentario ingresado:', comentario);
      // aca va la api
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

  return (
    <>
      <Natbar />

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

      <div className="text-black">
        <h1 className="text-4xl font-bold mt-6">Historial de Turnos</h1>

        <div className="flex flex-row gap-4 lg:-mt-11  mt-3 pl-3 mb-8 ">
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
          <CustomSelect
            Name="Mostrar"
            options={[
              { value: 'todos', label: 'Mostrar Todos' },
              { value: 'faltanCalificar', label: 'Faltan Calificar' },
              { value: 'calificados', label: 'Calificados' },
              { value: 'cancelados', label: 'Cancelados' },
              { value: 'pendientes', label: 'Pendientes' },
            ]}
            setOptions={setSelectedValueShow}
            setPage={setCurrentPage}
          />
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
                <li
                  key={turn.id}
                  className="flex flex-row items-center w-98  m-6 rounded-xl shadow-md p-6 h-45  hover:shadow-xl transition-shadow"
                >
                  <div className="mr-6 flex-shrink-0">
                    <img
                      className="h-20 w-20  object-cover border-2 border-gray-300"
                      src="/images/fotoUserId.png"
                      alt="Foto de perfil de usuario"
                    />
                  </div>
                  <div className="flex flex-col justify-center w-full">
                    <h2 className="text-lg font-bold text-gray-800 mb-1">
                      {turn.servicio.usuario?.nombreFantasia || 'Sin nombre'}
                    </h2>
                    <p className="text-sm text-gray-600 mb-1">
                      Fecha:{' '}
                      {new Date(turn.fechaHora).toLocaleDateString('es-AR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Servicio: {turn.servicio.tarea.nombreTarea}
                    </p>
                    <p className="text-sm text-gray-700 font-medium">
                      Monto: ${turn.montoFinal}
                    </p>
                    {(() => {
                      // Mostrar botón "Calificar" si el turno es menor a 1 mes y no fue calificado
                      const unMesPasado =
                        Date.now() - new Date(turn.fechaHora).getTime() <
                        30 * 24 * 60 * 60 * 1000; // dias, horas, minutos, segundos, milisegundos
                      console.log(unMesPasado);
                      if (
                        unMesPasado &&
                        turn.calificacion === null &&
                        turn.estado === 'completado'
                      ) {
                        return (
                          <button
                            onClick={() => openModal(turn)}
                            className="bg-naranja-1 w-4/5 text-white px-4 py-2 rounded-md  m-auto mt-2 hover:bg-white hover:text-naranja-1 border border-naranja-1 transition-colors duration-300"
                          >
                            Calificar
                          </button>
                        );
                      } else {
                        if (turn.calificacion !== null) {
                          return (
                            <div className="justify-center flex mt-3">
                              <Stars cant={turn.calificacion} />
                            </div>
                          );
                        } else {
                          if (turn.estado === 'completado') {
                            return (
                              <p className="mt-2">
                                Expiró el tiempo de calificación
                              </p>
                            );
                          } else {
                            return <p> Estado: {turn.estado}</p>;
                          }
                        }
                      }
                      return null;
                    })()}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay turnos.</p>
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
