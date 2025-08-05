import { useEffect, useState } from 'react';
import { apiServices } from '../../services/api';
import NatBar from '../navBar/Navbar.js';
import Footer from '../Footer/Footer';

type Turno = {
  id: number;
  fechaHora: Date;
  montoFinal: number;
  servicio: servicio;
  calificacion: number | null;
  comentario: string | null;
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
  nombreFantasia: string;
};

function TurnHistory() {
  const id = 1; // aca el id del usuario
  const [turns, setTurns] = useState<Turno[] | null>(null);
  // Modal para calificar
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<Turno | null>(null);

  // buscar todos los turnos del usuario con la informcaion del mismo.
  useEffect(() => {
    const turn = async (id: number) => {
      try {
        const res = await apiServices.turnos.getByUserId(id.toString());
        setTurns(res.data.data);
      } catch (err) {
        console.error('Error al cargar turnos:', err);
      }
    };
    if (id) {
      turn(id);
    }
  }, [id]);

  //modal para calificar
  const openModal = (modalData: Turno) => {
    setData(modalData);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
    setData(null);
  };

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
      <NatBar />
      {isOpen && data && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-5 backdrop-blur-xs  bg-opacity-40">
          <div className="bg-white rounded-lg shadow-2xl p-10 text-black w-6/12  h-6/12">
            <h1 className="text-2xl font-bold mb-4">Detalles del Turno</h1>
            <div className="flex flex-col gap-2 pb-3 items-start text-left pl-25">
              <p>
                Turno ID: <strong>{data.id}</strong>
              </p>
              <p>
                Prestatario:{' '}
                <strong>
                  {data.servicio.usuario.nombreFantasia || 'Sin nombre'}
                </strong>
              </p>
              <p>
                Fecha y Hora:{' '}
                {new Date(data.fechaHora).toLocaleDateString('es-AR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}{' '}
                a las{' '}
                {new Date(data.fechaHora).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
              </p>
            </div>
            <form action="" className="flex flex-col items-center gap-4">
              <div className="flex w-full items-center justify-between">
                <label htmlFor="calificacion" className="whitespace-nowrap">
                  Calificación:
                </label>
                <input
                  className="border border-naranja-1 rounded-md mx-2 p-2 w-full"
                  type="number"
                  min="1"
                  max="5"
                  id="calificacion"
                />
              </div>
              <div className="flex w-full items-center justify-between">
                <label htmlFor="comentario" className="whitespace-nowrap">
                  Comentario:
                </label>
                <textarea
                  className="border border-naranja-1 rounded-md mx-2 p-2 w-full"
                  id="comentario"
                  rows={4}
                />
              </div>
            </form>
            <button
              className="mt-4 px-4 py-2 bg-white text-amber-700 rounded hover:bg-amber-600 hover:text-white"
              onClick={closeModal}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      <div className="text-black">
        <h1 className="text-4xl font-bold my-4">Historial de Turnos</h1>

        {turns ? (
          turns.length > 0 ? (
            <ul className="flex flex-row flex-wrap items-center justify-center w-4/5 m-auto ">
              {turns.map((turn) => (
                <li
                  key={turn.id}
                  className="flex flex-row items-center w-98  m-6 rounded-xl shadow-md p-6 bg-white hover:shadow-xl transition-shadow"
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
                      // Mostrar botón "Calificar" si el turno es mayor a 1 mes y no fue calificado
                      const unMesPasado =
                        Date.now() - new Date(turn.fechaHora).getTime() >
                        30 * 24 * 60 * 60 * 1000; // dias, horas, minutos, segundos, milisegundos
                      if (unMesPasado && turn.calificacion === null) {
                        return (
                          <button
                            onClick={() => openModal(turn)}
                            className="bg-naranja-1 w-4/5 text-white px-4 py-2 rounded-md  m-auto mt-2 hover:bg-white hover:text-naranja-1 hover:border border-naranja-1 transition-colors duration-300"
                          >
                            Calificar
                          </button>
                        );
                      } else {
                        if (turn.calificacion !== null) {
                          return (
                            <button className="bg-naranja-1 w-4/5 text-green-600 px-4 py-2 rounded-md  m-auto mt-2">
                              Ver Calificación
                            </button>
                          );
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
        ) : (
          <p>Cargando turnos...</p>
        )}
      </div>

      <Footer />
    </>
  );
}
export default TurnHistory;
