import { useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { mercadoPagoApi } from '../../services/mercadoPagoApi';
<<<<<<< HEAD
// Inicializa Mercado Pago con tu public key
initMercadoPago('APP_USR-88fb13a3-185f-4cb7-a979-07c48e7fe2e4');
=======
>>>>>>> 0f77b45824cbbea0f0eaadf15887b04b27526032

type Props = {
  fechaHora: Date;
  montoFinal: number;
  servicio: Servicio;
  turno: number;
<<<<<<< HEAD
};
=======
  prestatarioEmail: string;
  prestatarioId: number;
  mpPublicKey: string;
};

>>>>>>> 0f77b45824cbbea0f0eaadf15887b04b27526032
type Servicio = {
  id: number;
  tarea: Tarea;
  usuario: Usuario;
};
<<<<<<< HEAD
=======

>>>>>>> 0f77b45824cbbea0f0eaadf15887b04b27526032
type Tarea = {
  nombreTarea: string;
  descripcionTarea: string;
  duracionTarea: number;
  tipoServicio: {
    id: number;
    nombreTipo: string;
  };
};
<<<<<<< HEAD
=======

>>>>>>> 0f77b45824cbbea0f0eaadf15887b04b27526032
type Usuario = {
  id: number;
  mail: string;
  nombreFantasia: string;
};

const MercadoPago = (props: Props) => {
<<<<<<< HEAD
  const [preferenceId, setPreferenceId] = useState('');

  const handlePago = async () => {
    try {
=======
  initMercadoPago(props.mpPublicKey);
  const [preferenceId, setPreferenceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePago = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('🔹 Creando preferencia con datos:', {
        title: props.servicio.tarea.nombreTarea,
        description: props.servicio.tarea.descripcionTarea,
        quantity: 1,
        currency: 'ARS',
        unit_price: props.montoFinal,
        turno: props.turno,
        prestatario_id: props.prestatarioId, // ✅ Corregido: usar prestatario_id
      });

>>>>>>> 0f77b45824cbbea0f0eaadf15887b04b27526032
      const response = await mercadoPagoApi.create({
        title: props.servicio.tarea.nombreTarea,
        description: props.servicio.tarea.descripcionTarea,
        quantity: 1,
        currency: 'ARS',
        unit_price: props.montoFinal,
        turno: props.turno,
<<<<<<< HEAD
      });
      setPreferenceId(response.data.preferenceId);
    } catch (error) {
      console.error('Error al crear la preferencia de pago:', error);
=======
        prestatario_id: props.prestatarioId, // ✅ Corregido: quitar prestatario_email
      });

      console.log('🔹 Respuesta del backend:', response.data);

      if (response.data?.preferenceId) {
        setPreferenceId(response.data.preferenceId);
      } else {
        throw new Error('No se recibió preferenceId del backend');
      }
    } catch (error: unknown) {
      console.error('❌ Error al crear la preferencia de pago:', error);

      let errorMessage = 'Error al crear la preferencia de pago';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
>>>>>>> 0f77b45824cbbea0f0eaadf15887b04b27526032
    }
  };

  return (
    <>
      {preferenceId && (
<<<<<<< HEAD
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-5 backdrop-blur-xs  bg-opacity-40">
          <div className="bg-white md:rounded-lg md:shadow-2xl md:p-10 text-black md:w-135    md:h-auto w-full px-10 h-full p-15 flex flex-col">
            <h2 className="text-lg">Pago del servicio</h2>
            <button
              onClick={() => setPreferenceId('')}
              className="-mt-9 ml-auto  hover:bg-gray-100 rounded-full transition-colors duration-200 p-2"
=======
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-5 backdrop-blur-xs bg-opacity-40">
          <div className="bg-white md:rounded-lg md:shadow-2xl md:p-10 text-black md:w-135 md:h-auto w-full px-10 h-full p-15 flex flex-col">
            <h2 className="text-lg">Pago del servicio</h2>
            <button
              onClick={() => {
                setPreferenceId('');
                setError('');
              }}
              className="-mt-9 ml-auto hover:bg-gray-100 rounded-full transition-colors duration-200 p-2"
>>>>>>> 0f77b45824cbbea0f0eaadf15887b04b27526032
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
<<<<<<< HEAD
              <p>Duración: {props.servicio.tarea.duracionTarea} minutos </p>
              <p>
                Dia-Hora:
=======
              <p>Duración: {props.servicio.tarea.duracionTarea} minutos</p>
              <p>
                Dia-Hora:{' '}
>>>>>>> 0f77b45824cbbea0f0eaadf15887b04b27526032
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
<<<<<<< HEAD
=======

            {/* ✅ Wallet de Mercado Pago */}
>>>>>>> 0f77b45824cbbea0f0eaadf15887b04b27526032
            <Wallet initialization={{ preferenceId }} />
          </div>
        </div>
      )}
<<<<<<< HEAD
      <div className="w-full">
        <button
          className="bg-naranja-1  text-white hover:text-naranja-1 hover:bg-white w-full rounded-2xl border-2 border-naranja-1 "
          onClick={handlePago}
        >
          Realizar Pago
        </button>
=======

      <div className="w-full">
        <button
          className="bg-naranja-1 text-white hover:text-naranja-1 hover:bg-white w-full rounded-2xl border-2 border-naranja-1 disabled:opacity-50"
          onClick={handlePago}
          disabled={loading}
        >
          {loading ? 'Creando pago...' : 'Realizar Pago'}
        </button>

        {/* ✅ Mostrar errores */}
        {error && (
          <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="text-sm">Error: {error}</p>
            <button
              onClick={() => setError('')}
              className="text-xs underline hover:no-underline"
            >
              Cerrar
            </button>
          </div>
        )}
>>>>>>> 0f77b45824cbbea0f0eaadf15887b04b27526032
      </div>
    </>
  );
};

export default MercadoPago;
