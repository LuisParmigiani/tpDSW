import { useState, useEffect } from 'react';
import DashboardSection from '../DashboardSection/DashboardSection';
import useAuth from '../../cookie/useAuth';
import { Alert, AlertTitle, AlertDescription } from '../Alerts/Alerts';
import StripeCreate from '../Stripe/stripe';

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
          
          <StripeCreate />
        ) : (
          
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Ingresos este mes</p>
                    <p className="text-xl sm:text-2xl font-bold text-green-600">
                      {formatearMoneda(estadisticas.ingresosMes)}
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                      <path fill="currentColor" d="M128 88a40 40 0 1 0 40 40a40 40 0 0 0-40-40Zm0 64a24 24 0 1 1 24-24a24 24 0 0 1-24 24Zm112-96H16a8 8 0 0 0-8 8v128a8 8 0 0 0 8 8h224a8 8 0 0 0 8-8V64a8 8 0 0 0-8-8Zm-46.35 128H62.35A56.78 56.78 0 0 0 24 145.65v-35.3A56.78 56.78 0 0 0 62.35 72h131.3A56.78 56.78 0 0 0 232 110.35v35.3A56.78 56.78 0 0 0 193.65 184ZM232 93.37A40.81 40.81 0 0 1 210.63 72H232ZM45.37 72A40.81 40.81 0 0 1 24 93.37V72ZM24 162.63A40.81 40.81 0 0 1 45.37 184H24ZM210.63 184A40.81 40.81 0 0 1 232 162.63V184Z"/>
                    </svg>
                  </div>
                </div>
              </div>

              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Ingresos este año</p>
                    <p className="text-xl sm:text-2xl font-bold text-blue-600">
                      {formatearMoneda(estadisticas.ingresosAnio)}
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Clientes este mes */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Clientes este mes</p>
                    <p className="text-xl sm:text-2xl font-bold text-orange-600">
                      {estadisticas.clientesMes}
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Clientes este año */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Clientes este año</p>
                    <p className="text-xl sm:text-2xl font-bold text-purple-600">
                      {estadisticas.clientesAnio}
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Estado de conexión */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-green-800">
                  Tu cuenta de Stripe está conectada correctamente
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardSection>
  );
}

export default PagosSection;
