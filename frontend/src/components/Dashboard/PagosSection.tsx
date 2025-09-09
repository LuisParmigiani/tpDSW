import { useState, useEffect } from 'react';
import DashboardSection from '../DashboardSection/DashboardSection';
import useAuth from '../../cookie/useAuth';
import { Alert, AlertTitle, AlertDescription } from '../Alerts/Alerts';
import StripeCreate from '../Stripe/stripe';
import CardPago from '../CardPago/CardPago';

interface EstadisticasPagos {
  ingresosMes: number;
  ingresosAnio: number;
  clientesMes: number;
  clientesAnio: number;
}

function PagosSection() {
  const { usuario, loading: authLoading } = useAuth();
  const [conectadoStripe, setConectadoStripe] = useState(false);
  const [estadisticas, setEstadisticas] = useState<EstadisticasPagos>({
    ingresosMes: 0,
    ingresosAnio: 0,
    clientesMes: 0,
    clientesAnio: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar si el usuario ya tiene Stripe conectado
  useEffect(() => {
    const verificarConexionStripe = async () => {
      try {
        // Esperar a que termine la autenticación
        if (authLoading) {
          return;
        }
        
        if (!usuario || !usuario.id) {
          setError('Usuario no autenticado');
          setLoading(false);
          return;
        }

        // TODO: Implementar llamada al API para verificar si Stripe está conectado
        // const response = await stripApi.verificarConexion(usuario.id);
        // setConectadoStripe(response.data.conectado);

        // Por ahora usar un valor temporal
        setConectadoStripe(false);
        
        setLoading(false);
      } catch (err) {
        console.error('Error verificando conexión Stripe:', err);
        setError('Error al verificar la conexión con Stripe');
        setLoading(false);
      }
    };

    verificarConexionStripe();
  }, [usuario, authLoading]);

  // Cargar estadísticas si está conectado
  useEffect(() => {
    const cargarEstadisticas = async () => {
      if (!conectadoStripe) return;

      try {
        setLoading(true);
        
    
        setEstadisticas({
          ingresosMes: 12500.50,
          ingresosAnio: 85430.75,
          clientesMes: 23,
          clientesAnio: 157
        });

        setLoading(false);
      } catch (err) {
        console.error('Error cargando estadísticas:', err);
        setError('Error al cargar las estadísticas de pagos');
        setLoading(false);
      }
    };

    cargarEstadisticas();
  }, [conectadoStripe, usuario]);

  const formatearMoneda = (cantidad: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(cantidad);
  };

  if (loading) {
    return (
      <DashboardSection>
        <div className="flex items-center justify-center h-48 sm:h-64 px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm sm:text-base">Cargando información de pagos...</p>
          </div>
        </div>
      </DashboardSection>
    );
  }

  if (error) {
    return (
      <DashboardSection>
        <div className="py-6 sm:py-8 px-4 flex flex-col items-center">
          <Alert variant="danger" className="mb-4 max-w-md w-full" style={{textAlign: 'center'}}>
            <AlertTitle style={{textAlign: 'left', width: '100%'}}>Error</AlertTitle>
            <AlertDescription style={{textAlign: 'left', width: '100%'}}>{error}</AlertDescription>
          </Alert>
          <button 
            onClick={() => window.location.reload()}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 text-sm sm:text-base"
          >
            Reintentar
          </button>
        </div>
      </DashboardSection>
    );
  }
  

  return (
    <DashboardSection>
      <div className="px-2 sm:px-0">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Pagos e Ingresos
        </h2>

        {!conectadoStripe ? (
          
          <StripeCreate onConnect={() => setConectadoStripe(true)} />
        ) : (
          
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
              
              <CardPago
                title="Ingresos este mes"
                value={estadisticas.ingresosMes}
                displayValue={formatearMoneda(estadisticas.ingresosMes)}
                color="green"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
                    <path d="M128 88a40 40 0 1 0 40 40a40 40 0 0 0-40-40Zm0 64a24 24 0 1 1 24-24a24 24 0 0 1-24 24Zm112-96H16a8 8 0 0 0-8 8v128a8 8 0 0 0 8 8h224a8 8 0 0 0 8-8V64a8 8 0 0 0-8-8Zm-46.35 128H62.35A56.78 56.78 0 0 0 24 145.65v-35.3A56.78 56.78 0 0 0 62.35 72h131.3A56.78 56.78 0 0 0 232 110.35v35.3A56.78 56.78 0 0 0 193.65 184ZM232 93.37A40.81 40.81 0 0 1 210.63 72H232ZM45.37 72A40.81 40.81 0 0 1 24 93.37V72ZM24 162.63A40.81 40.81 0 0 1 45.37 184H24ZM210.63 184A40.81 40.81 0 0 1 232 162.63V184Z"/>
                  </svg>
                }
              />

              <CardPago
                title="Ingresos este año"
                value={estadisticas.ingresosAnio}
                displayValue={formatearMoneda(estadisticas.ingresosAnio)}
                color="blue"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.4 21q-2.275 0-3.838-1.562T3 15.6q0-.95.325-1.85t.925-1.625L7.8 7.85L5.375 3h13.25L16.2 7.85l3.55 4.275q.6.725.925 1.625T21 15.6q0 2.275-1.575 3.838T15.6 21zm3.6-5q-.825 0-1.412-.587T10 14t.588-1.412T12 12t1.413.588T14 14t-.587 1.413T12 16M9.625 7h4.75l1-2h-6.75zM8.4 19h7.2q1.425 0 2.413-.987T19 15.6q0-.6-.213-1.162t-.587-1.013L14.525 9H9.5l-3.7 4.4q-.375.45-.587 1.025T5 15.6q0 1.425.988 2.413T8.4 19"/>
                  </svg>
                }
              />

              <CardPago
                title="Clientes este mes"
                value={estadisticas.clientesMes}
                color="orange"
                icon={
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />

              <CardPago
                title="Clientes este año"
                value={estadisticas.clientesAnio}
                color="purple"
                icon={
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
              />
            </div>

            
            
          </div>
        )}
      </div>
    </DashboardSection>
  );
}

export default PagosSection;
