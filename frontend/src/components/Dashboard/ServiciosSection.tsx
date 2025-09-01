import DashboardSection from '../DashboardSection/DashboardSection';
import TipoServicioCard, { TipoServicioData } from '../DashboardTipoCard';
import { useState, useEffect, useCallback } from 'react';
import { tiposServicioApi } from '../../services/tipoSericiosApi';

// Tipos de datos
type Tarea = {
  id: number;
  descripcion: string;
  tipoServicioId: number;
  seleccionada: boolean;
  precio: number;
};

// Función para convertir datos del API al formato del componente
const convertirTipoServicioADisplay = (tipoServicio: unknown): TipoServicioData => {
  console.log('Datos recibidos del backend:', tipoServicio);
  
  const tipoObj = tipoServicio as {
    id: number;
    nombreTipo?: string;
    descripcionTipo?: string;
    // Posibles variaciones del backend
    nombre?: string;
    descripcion?: string;
    name?: string;
    description?: string;
    nombreTipoServ?: string;
    descripcionTipoServ?: string;
  };
  
  // Usar los campos correctos del backend: nombreTipo y descripcionTipo
  const nombre = tipoObj.nombreTipo || tipoObj.nombre || tipoObj.name || tipoObj.nombreTipoServ || `Tipo ${tipoObj.id}`;
  const descripcion = tipoObj.descripcionTipo || tipoObj.descripcion || tipoObj.description || tipoObj.descripcionTipoServ || 'Sin descripción disponible';
  
  const resultado = {
    id: tipoObj.id,
    nombre: nombre,
    descripcion: descripcion,
    activo: false // Por defecto todos inician inactivos
  };
  
  console.log('Datos convertidos:', resultado);
  
  return resultado;
};

function ServiciosSection() {
  const [tiposServicio, setTiposServicio] = useState<TipoServicioData[]>([]);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [tareasVisibles, setTareasVisibles] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar tipos de servicio desde la API
  const cargarTiposServicio = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Iniciando carga de tipos de servicio...');
      const response = await tiposServicioApi.getAll();
      
      console.log('Respuesta completa del API:', response);
      console.log('response.data:', response.data);
      
      if (response.data && response.data.data) {
        console.log('Datos a convertir:', response.data.data);
        const tiposConvertidos = response.data.data.map(convertirTipoServicioADisplay);
        console.log('Tipos convertidos finales:', tiposConvertidos);
        setTiposServicio(tiposConvertidos);
      } else {
        // Probar diferentes estructuras de respuesta
        console.log('Probando estructura alternativa...');
        if (Array.isArray(response.data)) {
          console.log('La respuesta es un array directo:', response.data);
          const tiposConvertidos = response.data.map(convertirTipoServicioADisplay);
          setTiposServicio(tiposConvertidos);
        } else {
          console.error('Estructura de respuesta inesperada:', response);
          setError('Error al cargar los tipos de servicio');
        }
      }
    } catch (err) {
      console.error('Error cargando tipos de servicio:', err);
      setError('Error al cargar los tipos de servicio');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar tipos de servicio al montar el componente
  useEffect(() => {
    cargarTiposServicio();
  }, [cargarTiposServicio]);

  // Actualizar tareas visibles cuando cambian los tipos de servicio activos
  useEffect(() => {
    const tiposActivos = tiposServicio.filter(tipo => tipo.activo).map(tipo => tipo.id);
    const nuevasTareasVisibles = tareas.filter(tarea => tiposActivos.includes(tarea.tipoServicioId));
    setTareasVisibles(nuevasTareasVisibles);
  }, [tiposServicio, tareas]);

  const handleTipoServicioChange = (tipoId: number) => {
    setTiposServicio(prev => 
      prev.map(tipo => 
        tipo.id === tipoId ? { ...tipo, activo: !tipo.activo } : tipo
      )
    );
  };

  const handleTareaChange = (tareaId: number, campo: 'seleccionada' | 'precio', valor: boolean | number) => {
    setTareas(prev => 
      prev.map(tarea => 
        tarea.id === tareaId ? { ...tarea, [campo]: valor } : tarea
      )
    );
  };

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(precio);
  };

  return (
    <DashboardSection>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Mis Servicios</h2>
          <p className="text-gray-600">Selecciona los tipos de servicio que prestas y configura los precios de cada tarea.</p>
        </div>

        {/* Selector de Tipos de Servicio */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tipos de Servicio</h3>
          
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <span className="ml-2 text-gray-600">Cargando tipos de servicio...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error al cargar</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                  <button 
                    onClick={cargarTiposServicio}
                    className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm"
                  >
                    Reintentar
                  </button>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && (
            <div className="flex flex-wrap gap-3 justify-start">
              {tiposServicio.length > 0 ? (
                tiposServicio.map((tipo) => (
                  <TipoServicioCard
                    key={tipo.id}
                    tipoServicio={tipo}
                    onToggle={handleTipoServicioChange}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No se encontraron tipos de servicio disponibles.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tabla de Tareas */}
        {tareasVisibles.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Tareas Disponibles</h3>
              <p className="text-sm text-gray-500 mt-1">
                Selecciona las tareas que quieres prestar y configura tus precios
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seleccionar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarea
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo de Servicio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tareasVisibles.map((tarea) => {
                    const tipoServicio = tiposServicio.find(tipo => tipo.id === tarea.tipoServicioId);
                    return (
                      <tr key={tarea.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={tarea.seleccionada}
                              onChange={(e) => handleTareaChange(tarea.id, 'seleccionada', e.target.checked)}
                              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{tarea.descripcion}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            {tipoServicio?.nombre}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">$</span>
                            <input
                              type="number"
                              min="0"
                              step="100"
                              value={tarea.precio}
                              onChange={(e) => handleTareaChange(tarea.id, 'precio', parseInt(e.target.value) || 0)}
                              disabled={!tarea.seleccionada}
                              className={`w-24 px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500 ${
                                tarea.seleccionada 
                                  ? 'border-gray-300 bg-white text-gray-900' 
                                  : 'border-gray-200 bg-gray-50 text-gray-400'
                              } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mensaje cuando no hay tipos seleccionados */}
        {tareasVisibles.length === 0 && (
          <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            <div className="mx-auto w-12 h-12 text-gray-400 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No hay tipos de servicio seleccionados</h3>
            <p className="text-gray-500">Selecciona al menos un tipo de servicio arriba para ver las tareas disponibles.</p>
          </div>
        )}

        {/* Resumen */}
        {tareasVisibles.filter(t => t.seleccionada).length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-orange-800">
                  Tienes {tareasVisibles.filter(t => t.seleccionada).length} tareas seleccionadas
                </h3>
                <div className="text-sm text-orange-700 mt-1">
                  Precio promedio: {formatearPrecio(
                    tareasVisibles.filter(t => t.seleccionada).reduce((sum, t) => sum + t.precio, 0) / 
                    tareasVisibles.filter(t => t.seleccionada).length || 0
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardSection>
  );
}

export default ServiciosSection;
