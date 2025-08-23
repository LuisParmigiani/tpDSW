import { useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

// Inicializa Mercado Pago con tu public key
initMercadoPago('APP_USR-0e40b53e-63b6-4362-b796-1a7b894aaf33');

type Props = {
  fechaHora: Date;
  montoFinal: number;
  servicio: Servicio;
};
type Servicio = {
  id: number;
  tarea: Tarea;
  usuario: Usuario;
};
type Tarea = {
  nombreTarea: string;
  descripcionTarea: number;
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

const MercadoPago = (props: Props) => {
  const [preferenceId, setPreferenceId] = useState('');

  const handlePago = () => {
    fetch('http://localhost:3000/api/pago', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: props.servicio.tarea.nombreTarea,
        description: props.servicio.tarea.descripcionTarea,
        quantity: 1,
        currency: 'ARS',
        unit_price: props.montoFinal,
      }),
    })
      .then((res) => res.json())
      .then((data) => setPreferenceId(data.preferenceId));
  };

  return (
    <>
      {preferenceId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-5 backdrop-blur-xs  bg-opacity-40">
          <div className="bg-white md:rounded-lg md:shadow-2xl md:p-10 text-black md:w-135    md:h-auto w-full px-10 h-full p-15 flex flex-col">
            <h2 className="text-lg">Pago del servicio</h2>
            <button
              onClick={() => setPreferenceId('')}
              className="-mt-9 ml-auto  hover:bg-gray-100 rounded-full transition-colors duration-200 p-2"
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
            <div className="items-start text-start">
              <p>Tipo: {props.servicio.tarea.tipoServicio.nombreTipo}</p>
              <p>Tarea: {props.servicio.tarea.nombreTarea}</p>
              <p>Descripción: {props.servicio.tarea.descripcionTarea}</p>
              <p>Duración: {props.servicio.tarea.duracionTarea} minutos </p>
              <p>
                Dia-Hora:
                {new Date(props.fechaHora).toLocaleString('es-AR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <p className="pb-10">Monto final: ${props.montoFinal}</p>
            </div>
            <Wallet initialization={{ preferenceId }} />
          </div>
        </div>
      )}
      <div className="w-full">
        <button
          className="bg-naranja-1  text-white hover:text-naranja-1 hover:bg-white w-full rounded-2xl border-2 border-naranja-1 "
          onClick={handlePago}
        >
          Realizar Pago
        </button>
      </div>
    </>
  );
};

export default MercadoPago;
