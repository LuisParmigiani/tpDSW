import Stars from '../stars/Stars';
import MercadoPago from '../MercadoPago/MercadoPago.tsx';
<<<<<<< HEAD

=======
const mpPublicKey = import.meta.env.VITE_MP_PUBLIC_KEY;
>>>>>>> 0f77b45824cbbea0f0eaadf15887b04b27526032
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
type Pago = {
  id: number;
  estado: string;
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
  navigate: (path: string) => void;
  turn: Turno;
  openModal: (turn: Turno) => void;
  cancelarTurno: (id: number) => void;
};

function TurnCard({ navigate, turn, openModal, cancelarTurno }: Props) {
  return (
    <li
      key={turn.id}
      className="flex flex-row items-center w-98  m-6 rounded-xl shadow-md p-6 h-55  hover:shadow-xl transition-shadow"
    >
      <div className="mr-6 flex-shrink-0">
        <img
          className="h-20 w-20  object-cover border-2 border-gray-300"
          src="/images/fotoUserId.png"
          alt="Foto de perfil de usuario"
        />
      </div>
      <div className="flex flex-col mx-auto gap-1  ml-3 items-start w-full">
        <h2 className="text-lg font-bold text-gray-800 mb-1">
          {turn.servicio.usuario?.nombreFantasia}
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
        {/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */}
        {(() => {
          // Mostrar botón "Calificar" si el turno es menor a 1 mes y no fue calificado y fue pagado.
          const unMesPasado =
            Date.now() - new Date(turn.fechaHora).getTime() <
            30 * 24 * 60 * 60 * 1000; // dias, horas, minutos, segundos, milisegundos

          if (!turn.hayPagoAprobado && turn.estado === 'completado') {
            return (
              <>
                <MercadoPago
                  fechaHora={turn.fechaHora}
                  montoFinal={turn.montoFinal}
                  servicio={turn.servicio}
                  turno={turn.id}
<<<<<<< HEAD
=======
                  prestatarioEmail={turn.usuario.mail}
                  prestatarioId={turn.servicio.usuario.id}
                  mpPublicKey={mpPublicKey}
>>>>>>> 0f77b45824cbbea0f0eaadf15887b04b27526032
                />
                <button
                  className="bg-naranja-1 text-white hover:text-naranja-1 hover:bg-white w-full rounded-2xl border-2 border-naranja-1"
                  onClick={() => {
                    // Navegar a la ruta con el ID dinámico
                    navigate(`/borrower/${turn.servicio.usuario.id}`);
                  }}
                >
                  Volver a contratar
                </button>
              </>
            );
          } else if (
            unMesPasado && // verifico si no paso mas de un mes
            turn.calificacion === null && // verifico que no tenga ya calificacion
            turn.estado === 'completado' // verifico que este completado
          ) {
            return (
              <>
                <button
                  onClick={() => openModal(turn)}
                  className="bg-naranja-1  text-white hover:text-naranja-1 hover:bg-white w-full rounded-2xl border-2 border-naranja-1"
                >
                  Calificar
                </button>
                <button
                  className="bg-naranja-1 text-white hover:text-naranja-1 hover:bg-white w-full rounded-2xl border-2 border-naranja-1"
                  onClick={() => {
                    // Navegar a la ruta con el ID dinámico
                    navigate(`/borrower/${turn.servicio.usuario.id}`);
                  }}
                >
                  Volver a contratar
                </button>
              </>
            );
          } else {
            // Se pone la calificacion puesta por el usuario Si es que la tiene.
            if (turn.calificacion !== null) {
              return (
                <>
                  <div className="justify-center flex">
                    <Stars cant={turn.calificacion} />
                  </div>
                  <button
                    className="bg-naranja-1 text-white hover:text-naranja-1 hover:bg-white w-full rounded-2xl border-2 border-naranja-1"
                    onClick={() => {
                      // Navegar a la ruta con el ID dinámico
                      navigate(`/borrower/${turn.servicio.usuario.id}`);
                    }}
                  >
                    Volver a contratar
                  </button>
                </>
              );
            } else {
              // Si el turno no paso por todos los otros if y entra aca se interpreta que ya paso un mes por lo que ya no puede calificar.
              if (turn.estado === 'completado') {
                return (
                  <>
                    <p className="mt-2">Expiró el tiempo de calificación</p>
                    <button
                      className="bg-naranja-1 text-white hover:text-naranja-1 hover:bg-white w-full rounded-2xl border-2 border-naranja-1"
                      onClick={() => {
                        // Navegar a la ruta con el ID dinámico
                        navigate(`/borrower/${turn.servicio.usuario.id}`);
                      }}
                    >
                      Volver a contratar
                    </button>
                  </>
                );
              } else {
                // Si el turno no paso por todos los otros if y entra aca se interpreta que el turno esta confirmado o pendiente por lo que todavia se puede cancelar.
                if (turn.estado !== 'cancelado') {
                  return (
                    <>
                      <p> Estado: {turn.estado}</p>
                      <button
                        onClick={() => cancelarTurno(turn.id)}
                        className="bg-naranja-1  text-white hover:text-naranja-1 hover:bg-white w-full rounded-2xl border-2 border-naranja-1"
                      >
                        Cancelar
                      </button>
                    </>
                  );
                }
                return <p> Estado: {turn.estado}</p>;
              }
            }
          }
        })()}
      </div>
    </li>
  );
}

export default TurnCard;
