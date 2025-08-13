import { useEffect, useState } from 'react';
import CustomSelect from '../Select/CustomSelect';
import { turnosApi } from '../../services/turnosApi';
// cuando apriero esc que se salga del menu
type Usuario = {
  id: number;
  nombre: string;
  apellido: string;
  foto: string;
  mail: string;
  telefono: string;
  tiposDeServicio: TipoDeServicio[];
  horarios: {
    dia: string;
    horaDesde: string;
    horaHasta: string;
  }[];
  servicios: Servicio[];
};
type TipoDeServicio = {
  id: number;
  nombreTipo: string;
};

type Servicio = {
  id: number;
  precio: number;
  tarea: Tarea;
};

type Tarea = {
  id: number;
  nombreTarea: string;
  descripcionTarea: string;
  duracion: number;
  tipoServicio: TipoDeServicio;
};

type Option = {
  value: string;
  label: string;
};

type Props = {
  prestatario: Usuario;
  setopen: (open: boolean) => void;
};

function NewTurnModal({ prestatario, setopen }: Props) {
  //Variable de tipo opciones definida antes para los selects
  const serviciosoptions: Option[] = [];
  const [tareasOptions, setTareasOptions] = useState<Option[]>([]);
  const [horariosManana, setHorariosManana] = useState<number[]>([]); // Se Guardan todos los horarios posibles para esa fecha
  const [horariosTarde, setHorariosTarde] = useState<number[]>([]); // Se Guardan todos los horarios posibles para esa fecha

  const [dayForTurn, setDayForTurn] = useState(''); // se elige una fecha especifica
  const [horarioSelected, setHorarioSelected] = useState(''); // Se guarda el horario seleccionado
  const [selectedService, setSelectedService] = useState(''); // se guarda el servicio seleccionado
  const [page, setPage] = useState(1); // Pagina del modal
  const [diasPage, setDiasPage] = useState(1); // pagina de los dias cambia de 6 en 6
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false); // Modal de confirmacion
  const [selectedTask, setSelectedTask] = useState(''); // se guarda la tarea seleccionada

  // Efecto para desactivar el scroll de la página cuando el modal esté abierto
  useEffect(() => {
    // Cuando el modal se abre, desactivamos el scroll de la página
    document.body.style.overflow = 'hidden';

    // Cleanup function: cuando el modal se cierra, restauramos el scroll
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []); // Se ejecuta al montar el componente (cuando el modal se abre)

  // Efecto para cerrar el modal al presionar la tecla Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setopen(false);
      }
    };

    // Agregar el event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup function: desactiva el event listener cuando el componente se desmonte
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setopen]); // Dependencia en setopen para asegurar que siempre tenga la referencia correcta

  // Variable de opciones de las tareas segun el servicio seleccionado.
  useEffect(() => {
    const newTareasOptions: Option[] = [];
    prestatario.servicios.forEach((servicio) => {
      if (servicio.tarea.tipoServicio.nombreTipo === selectedService) {
        newTareasOptions.push({
          value: servicio.tarea.nombreTarea,
          label: servicio.tarea.nombreTarea,
        });
      }
    });
    setTareasOptions(newTareasOptions);
  }, [selectedService, prestatario]);

  // Efecto para obtener los horarios no disponibles (Los turnos que estan ese dia) según el día seleccionado
  useEffect(() => {
    // Función para generar los horarios disponibles
    const generateHorarios = (
      horaDesde: string,
      horaHasta: string,
      turnosOcupados: number[][] = []
    ) => {
      // Convierte "08:00:00" a minutos totales
      const [hDesde, mDesde] = horaDesde.split(':').map(Number);
      const [hHasta, mHasta] = horaHasta.split(':').map(Number);
      let horaAct = hDesde * 60 + mDesde;
      const horaHastaMin = hHasta * 60 + mHasta;
      const taskDuration =
        prestatario.servicios.find(
          (servicio) => servicio.tarea.nombreTarea === selectedTask
        )?.tarea.duracion || 30;

      const nuevosHorariosManana: number[] = [];
      const nuevosHorariosTarde: number[] = [];
      while (horaAct + taskDuration <= horaHastaMin) {
        // Es la suma de arranque mas la duracion para ver que entre la tarea completa y no se solapen
        const finNuevoTurno = horaAct + taskDuration;

        // Verificar si el turno con la duracion entra o se solapa
        const haySolapamiento = turnosOcupados.some(
          ([inicioOcupado, finOcupado]) => {
            // No entra si arranca antes de que termine el turno o termina despues de que arranca un turno
            return horaAct < finOcupado && finNuevoTurno > inicioOcupado;
          }
        );

        if (!haySolapamiento) {
          if (horaAct < 13 * 60) {
            nuevosHorariosManana.push(horaAct);
          } else {
            nuevosHorariosTarde.push(horaAct);
          }
        }

        horaAct += 30; // Incrementar en 30 minutos
      }
      setHorariosManana(nuevosHorariosManana);
      setHorariosTarde(nuevosHorariosTarde);
    };
    const fetchHorarios = async () => {
      if (dayForTurn) {
        const response = await turnosApi.getTurnsPerDay(
          prestatario.id.toString(),
          dayForTurn
        );

        // Crear array de turnos ocupados
        const turnosOcupados: number[][] = [];
        response.data.data.forEach(
          (turno: {
            fechaHora: string;
            servicio: { tarea: { duracionTarea: number } };
          }) => {
            const minutosInicio =
              new Date(turno.fechaHora).getHours() * 60 +
              new Date(turno.fechaHora).getMinutes();

            turnosOcupados.push([
              minutosInicio,
              minutosInicio + Number(turno.servicio.tarea.duracionTarea),
            ]);
          }
        );

        // Ahora generar horarios con los turnos ocupados
        generateHorarios(
          prestatario.horarios[new Date(dayForTurn).getDay()].horaDesde,
          prestatario.horarios[new Date(dayForTurn).getDay()].horaHasta,
          turnosOcupados
        );
      }
    };
    fetchHorarios();
  }, [
    dayForTurn,
    prestatario.id,
    prestatario.horarios,
    prestatario.servicios,
    selectedTask,
  ]);

  // Función para convertir minutos a formato Horas hh:mm
  const minutosAHora = (minutos: number): string => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}`;
  };

  // Función para mostrar los días de la semana con las fechas
  const mostrarDias = () => {
    const primerDia = new Date();
    primerDia.setDate(primerDia.getDate() + (diasPage - 1) * 6);
    const dias = [
      ['Domingo', 'Dom'],
      ['Lunes', 'Lun'],
      ['Martes', 'Mar'],
      ['Miércoles', 'Mie'],
      ['Jueves', 'Jue'],
      ['Viernes', 'Vie'],
      ['Sábado', 'Sab'],
    ];
    const botonesDias = [];

    for (let i = 0; i < 6; i++) {
      const fecha = new Date(primerDia);
      fecha.setDate(primerDia.getDate() + i);
      const diaIndex = fecha.getDay();

      botonesDias.push(
        <>
          <button
            onClick={() => setDayForTurn(fecha.toISOString().split('T')[0])}
            className={
              dayForTurn === fecha.toISOString().split('T')[0]
                ? 'sm:block hidden  bg-naranja-1  rounded-md w-25 m-auto text-white py-2  border-2 border-naranja-1  items-center  text-center  justify-center transition-colors duration-300'
                : 'sm:flex hidden bg-neutral-200 rounded-md py-2 w-25 m-auto px-4 hover:bg-neutral-400 text-center  flex-col'
            }
          >
            {fecha.getDate().toString().padStart(2, '0')}-
            {(fecha.getMonth() + 1).toString().padStart(2, '0')}
            <br />
            {dias[diaIndex][0]}
          </button>
          <button
            onClick={() => setDayForTurn(fecha.toISOString().split('T')[0])}
            className={
              dayForTurn === fecha.toISOString().split('T')[0]
                ? 'mt-4 sm:hidden bg-naranja-1 border-none rounded-md w-25 m-auto text-white  hover:bg-neutral-200 border-2 border-naranja-1 hover:text-naranja-1 transition-colors duration-300'
                : 'mt-4 sm:hidden flex bg-neutral-200 rounded-md w-25 m-auto  hover:bg-neutral-400 text-center flex-col'
            }
          >
            {fecha.getDate().toString().padStart(2, '0')} -
            {(fecha.getMonth() + 1).toString().padStart(2, '0')}
            <br />
            {dias[diaIndex][1]}
          </button>
        </>
      );
    }

    return (
      <div className="grid grid-cols-3  sm:grid-cols-6 sm:gap-2 mt-2 mb-4 w-full">
        {botonesDias}
      </div>
    );
  };

  // Generar opciones de servicios
  prestatario.tiposDeServicio.forEach((tipo) => {
    serviciosoptions.push({ value: tipo.nombreTipo, label: tipo.nombreTipo });
  });

  // Guardar el turno (persistirlo)
  const guardarTurno = async () => {
    try {
      const services = prestatario.servicios.find(
        (s) => s.tarea.nombreTarea === selectedTask
      );
      const precio = services?.precio || 100;
      await turnosApi.create({
        Usuario: 2, //aca va el token del usuario regitrado ,
        servicio: services?.id,
        tarea: services?.tarea.id,
        fechaHora: `${dayForTurn}T${horarioSelected}:00`,
        estado: 'pendiente',
        montoFinal: precio * 0.02 + precio,
      });
      setSelectedService('');
      setSelectedTask('');
      setDayForTurn('');
      setHorarioSelected('');
      setopen(false);
      setConfirmationModalOpen(false);
    } catch (error) {
      console.error('Error al guardar el turno:', error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-5 backdrop-blur-xs bg-opacity-40"
      onClick={() => {
        setopen(false); // para cuando apretas afuera de la parte blanca se cierre
      }}
    >
      <div
        className={
          confirmationModalOpen
            ? 'bg-white md:rounded-lg md:shadow-2xl sm:p-10 text-black sm:w-auto flex flex-col lg:min-h-6/12 md:h-auto w-full h-screen pt-10 sm:max-h-10/12 overflow-y-auto gap-4'
            : 'hidden'
        }
        onClick={(e) => {
          e.stopPropagation(); // desactiva que cuando hagas click se salga en la parte blanca
        }}
      >
        <div className="flex justify-end z-30 bg-transparent w-auto">
          <button
            onClick={() => {
              setConfirmationModalOpen(false);
              setopen(false);
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Cerrar modal"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <h1 className="text-3xl font-bold -mt-14 sm:p-0 px-15 ">
          Confirmacion del Turno:
        </h1>
        <h2 className="text-2xl ">
          Prestatario: {prestatario.nombre} {prestatario.apellido}
        </h2>
        <div className="flex flex-col sm:flex-row">
          <div className="flex flex-row px-5 sm:p-0">
            <div className="flex flex-col items-start gap-3 mb-4   lg:ml-11 ">
              <p>Mail: </p>
              <p>Telefono: </p>
              <p>Servicio: </p>
              <p>Tarea: </p>
              <p>Dia: </p>
              <p>Hora: </p>
            </div>
            <div className="flex flex-col items-start gap-3 mb-4 ml-11">
              <p>{prestatario.mail}</p>
              <p>{prestatario.telefono}</p>
              <p>{selectedService}</p>
              <p>{selectedTask}</p>
              <p>{dayForTurn}</p>
              <p>{horarioSelected}</p>
            </div>
          </div>
          <div className="flex sm:flex-col sm:p-0 px-3 items-start gap-7 mb-4 sm:ml-11 h-full justify-between mt-4">
            <button
              onClick={() => {
                setopen(false);
                setConfirmationModalOpen(false);
                setSelectedService('');
                setDayForTurn('');
                setHorarioSelected('');
              }}
              className="bg-red-500 rounded-md w-full py-2 px-4 hover:bg-white hover:text-red-500 text-white border-2 border-red-500 text-center "
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                setConfirmationModalOpen(false);
                setPage(1);
              }}
              className="bg-blue-950 text-md w-full text-white border-2 border-blue-950 hover:text-blue-950 rounded-md py-2 px-7 hover:bg-white text-center "
            >
              Editar
            </button>

            <button
              className="bg-green-700 border-2 w-full  border-green-700 text-white rounded-md py-2 px-4 hover:bg-white hover:text-green-700 text-center "
              onClick={guardarTurno}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
      <div
        className={
          confirmationModalOpen
            ? 'hidden'
            : 'bg-white md:rounded-lg md:shadow-2xl py-10 items-start text-black lg:w-6/12 md:w-9/12 flex flex-col lg:min-h-6/12 md:h-auto w-full h-screen sm:max-h-[85vh] sm:h-auto overflow-y-auto gap-4'
        }
        onClick={(e) => {
          e.stopPropagation(); // desactiva que cuando hagas click se salga en la parte blanca
        }}
      >
        <div className="flex justify-end ml-auto z-30 bg-transparent w-auto">
          <button
            onClick={() => setopen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Cerrar modal"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <h1 className="text-2xl font-bold -mt-13 px-10">Sacar turno</h1>
        <h2 className="text-xl font-bold px-10">
          Prestatario: {prestatario.nombre} {prestatario.apellido}
        </h2>
        <h2 className="px-10">Contacto:</h2>
        <h2 className="px-10">- {prestatario.mail}</h2>
        <h2 className="px-10">- {prestatario.telefono}</h2>
        {page === 1 && (
          <div className="px-10 w-full gap-4 ">
            <div className="w-full">
              <CustomSelect
                Name="Tipo Servicios"
                options={serviciosoptions}
                setOptions={setSelectedService}
                value={selectedService}
              />
            </div>
            <div className="w-full mt-5 ">
              <CustomSelect
                Name={
                  selectedService ? 'Tareas' : 'Seleccione un servicios antes'
                }
                options={tareasOptions}
                setOptions={setSelectedTask}
                value={selectedTask}
              />
            </div>
          </div>
        )}
        {page === 2 && (horariosManana || horariosTarde) && (
          <div className="w-full ">
            <h2 className="text-xl font-bold">Dias Disponibles:</h2>
            <div className="flex flex-row justify-between items-center w-full ">
              <button
                onClick={() => setDiasPage((prev) => Math.max(prev - 1, 1))}
              >
                <svg
                  width="32"
                  height="40"
                  viewBox="0 0 24 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={
                    diasPage === 1
                      ? 'color-neutral-300 cursor-not-allowed rounded p-1 sm:w-full w-6'
                      : 'cursor-pointer hover:bg-gray-100 rounded p-1  sm:w-full w-6'
                  }
                >
                  <path
                    d="M15 22L9 15L15 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {mostrarDias()}
              <button onClick={() => setDiasPage((prev) => Math.min(prev + 1))}>
                <svg
                  width="32"
                  height="40"
                  viewBox="0 0 24 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="cursor-pointer hover:bg-gray-100 rounded p-1 sm:w-full w-6"
                  style={{ transform: 'rotate(180deg)' }}
                >
                  <path
                    d="M15 22L9 15L15 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <h2 className="text-xl font-bold">Horarios Disponibles:</h2>
            <h2>Mañana:</h2>
            <div className="grid grid-cols-4 gap-2 mt-5 px-7">
              {horariosManana.map((horario) => (
                <button
                  key={horario}
                  className={
                    minutosAHora(horario) === horarioSelected
                      ? 'bg-naranja-1 border-none rounded-md text-white px-6 py-2 hover:bg-neutral-200 border-2 border-naranja-1 hover:text-naranja-1 transition-colors duration-300'
                      : 'bg-neutral-200 rounded-md py-2 hover:bg-neutral-400'
                  }
                  onClick={() => setHorarioSelected(minutosAHora(horario))}
                >
                  {' '}
                  {minutosAHora(horario)}
                </button>
              ))}
            </div>
            <h2>Tarde:</h2>
            <div className="grid grid-cols-4 gap-2 mt-5 px-7">
              {horariosTarde.map((horario) => (
                <button
                  key={horario}
                  className={
                    minutosAHora(horario) === horarioSelected
                      ? 'bg-naranja-1 border-none rounded-md text-white px-6 py-2 hover:bg-neutral-200 border-2 border-naranja-1 hover:text-naranja-1 transition-colors duration-300'
                      : 'bg-neutral-200 rounded-md py-2 hover:bg-neutral-400'
                  }
                  onClick={() => setHorarioSelected(minutosAHora(horario))}
                >
                  {' '}
                  {minutosAHora(horario)}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-6 justify-around mt-4 px-10">
          <button
            className={
              page === 1
                ? 'bg-neutral-200 border-none rounded-4xl text-black px-6 py-2  flex-1 max-w-32 '
                : 'bg-naranja-1  rounded-4xl text-white px-6 py-2 hover:bg-white border-2 border-naranja-1 hover:text-naranja-1 transition-colors duration-300 flex-1 max-w-32'
            }
            onClick={() => {
              setPage(1);
              setSelectedService('');
            }}
            disabled={page === 1}
          >
            Volver
          </button>
          {page === 1 && (
            <button
              className={
                selectedTask
                  ? 'bg-naranja-1 rounded-4xl text-white px-6 py-2 hover:bg-white border-2 border-naranja-1 hover:text-naranja-1 transition-colors duration-300 flex-1 max-w-32'
                  : 'bg-neutral-300 border-none rounded-4xl text-neutral-500 px-6 py-2 flex-1 max-w-32 cursor-not-allowed'
              }
              onClick={selectedTask ? () => setPage(2) : undefined}
              disabled={!selectedTask}
            >
              Siguiente
            </button>
          )}
          {page === 2 && (
            <button
              onClick={() => {
                setConfirmationModalOpen(true);
              }}
              className={
                !horarioSelected || !dayForTurn
                  ? 'bg-neutral-300 border-none rounded-4xl text-neutral-500 px-6 py-2 flex-1 max-w-32 cursor-not-allowed'
                  : 'bg-green-700 rounded-4xl  text-white px-6 py-2 hover:bg-white border-2 border-green-700 hover:text-green-700 transition-colors duration-300 flex-1 max-w-32'
              }
              disabled={!horarioSelected || !dayForTurn}
            >
              Confirmar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewTurnModal;
