import StarRating from '../stars/RatingStars';

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
type Props = {
  data: Turno;
  closeModal: () => void;
  startRating: number;
  setStartRating: (rating: number) => void;
  comentario: string;
  setComentario: (comment: string) => void;
  SaveRating: () => void;
};

function CalificationModal({
  data,
  closeModal,
  startRating,
  setStartRating,
  comentario,
  setComentario,
  SaveRating,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-5 backdrop-blur-xs  bg-opacity-40">
      <div className="bg-white md:rounded-lg md:shadow-2xl md:p-10 text-black lg:w-6/12 md:w-9/12  lg:min-h-6/12 md:h-auto w-full px-10 h-full p-15">
        <h1 className="text-2xl font-bold mb-4">Detalles del Turno</h1>
        <div className="flex flex-col gap-2 pb-3 items-start text-left md:pl-25">
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
          <div className="flex w-full items-center gap-6 ">
            <span className="whitespace-nowrap">Calificación:</span>
            <StarRating initialRating={startRating} onChange={setStartRating} />
          </div>
          <div className="md:flex w-full items-center justify-between">
            <label
              htmlFor="comentario"
              className="whitespace-nowrap md:block hidden"
            >
              Comentario:
            </label>
            <textarea
              className="border border-naranja-1 rounded-md mx-2 p-2 w-full"
              id="comentario"
              rows={4}
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Escribe tu comentario aquí..."
            />
          </div>
        </form>
        <button
          className=" mt-4 px-4 py-2 hover:text-neutral-400  rounded-sm  border-1 border-neutral-400 bg-neutral-400 hover:bg-white text-white mr-14 "
          onClick={closeModal}
        >
          Cerrar
        </button>
        <button
          className=" mt-4 px-4 py-2 hover:text-amber-700  rounded-sm  border-1 border-naranja-1 bg-naranja-1 hover:bg-white text-white"
          onClick={SaveRating}
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
export default CalificationModal;
