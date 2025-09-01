type Props = {
  estado: string;
  cerrar: () => void;
};

function DevolucionPago({ estado, cerrar }: Props) {
  let message;
  let modalstyle;
  let buttonstyle;
  if (estado === 'success') {
    message = 'El pago del servicio se ha procesado correctamente.';
    modalstyle = 'bg-green-100 border-green-400 text-green-700';
    buttonstyle = 'bg-green-500 hover:bg-green-600';
  } else if (estado === 'failure') {
    message =
      'Ha ocurrido un error al procesar el pago intente de nuevo luego.';
    modalstyle = 'bg-red-100 border-red-400 text-red-700';
    buttonstyle = 'bg-red-500 hover:bg-red-600';
  } else {
    message = 'El pago se está procesando revise luego';
    modalstyle = 'bg-gray-200 border-gray-400 text-gray-700';
    buttonstyle = 'bg-gray-500 hover:bg-gray-600';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-5 backdrop-blur-xs bg-opacity-40">
      <div
        className={`${modalstyle} rounded-lg shadow-2xl p-10 flex flex-col gap-4 w-120`}
      >
        <h1 className="text-2xl font-semibold">Informe del Pago</h1>
        <button
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 ml-auto -mt-13"
          aria-label="Cerrar modal"
          onClick={() => {
            cerrar();
          }}
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
        <h2>{message}</h2>

        <button
          className={`${buttonstyle} text-white rounded-md p-2`}
          onClick={cerrar}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
export default DevolucionPago;
