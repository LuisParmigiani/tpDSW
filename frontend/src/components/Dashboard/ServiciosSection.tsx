import DashboardSection from '../DashboardSection/DashboardSection';
import TipoServicioCard, { TipoServicioData } from '../DashboardTipoCard';
import TareaRow, { type Tarea } from '../TareaRow/TareaRow';
import { useState, useEffect, useCallback } from 'react';
import { tiposServicioApi } from '../../services/tipoSericiosApi';
import { tareasApi } from '../../services/tareasApi';
import { serviciosApi } from '../../services/serviciosApi';
import { Alert, AlertDescription } from '../Alerts/Alerts';
import useAuth from '../../cookie/useAuth';
import StripeConnection from '../StripeConnection/StripeConnection';

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
  const { usuario } = useAuth(); // Obtener usuario logueado
  const [tiposServicio, setTiposServicio] = useState<TipoServicioData[]>([]);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [tareasVisibles, setTareasVisibles] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para la funcionalidad de guardado
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<'success' | 'danger'>('success');
  const [alertMessage, setAlertMessage] = useState('');
  
  // Estado para la paginación por tipo de servicio
  const [tipoServicioActivo, setTipoServicioActivo] = useState<number | null>(null);

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

  // Cargar tareas desde la API
  const cargarTareas = useCallback(async () => {
    try {
      console.log('Iniciando carga de tareas...');
      const response = await tareasApi.getAll();
      
      console.log('Respuesta completa del API de tareas:', response);
      console.log('response.data:', response.data);
      
      if (response.data && response.data.data) {
        console.log('Datos de tareas a convertir:', response.data.data);
        console.log('Muestra de las primeras 3 tareas sin procesar:', response.data.data.slice(0, 3));
        
        const tareasConvertidas = response.data.data.map((tarea: {
          id: number;
          nombreTarea?: string;
          descripcionTarea?: string;
          duracionTarea?: number;
          tipoServicio?: number | { id: number }; // Puede ser número directo o objeto
          tipoServicioId?: number;
          tipo_servicio_id?: number;
        }) => {
          console.log('Procesando tarea:', tarea);
          // Si tipoServicio es un número, usarlo directamente; si es objeto, usar .id
          let tipoServicioId: number;
          if (typeof tarea.tipoServicio === 'number') {
            tipoServicioId = tarea.tipoServicio;
          } else if (tarea.tipoServicio && typeof tarea.tipoServicio === 'object') {
            tipoServicioId = tarea.tipoServicio.id;
          } else {
            tipoServicioId = tarea.tipoServicioId || tarea.tipo_servicio_id || 0;
          }
          
          console.log(`Tarea ID ${tarea.id}: tipoServicioId calculado = ${tipoServicioId}`);
          
          return {
            id: tarea.id,
            descripcion: tarea.nombreTarea || tarea.descripcionTarea || `Tarea ${tarea.id}`,
            tipoServicioId: tipoServicioId,
            seleccionada: false, // Por defecto no seleccionada
            precio: 0, // Precio inicial
            duracion: tarea.duracionTarea || 0 // Guardamos la duración también
          };
        });
        console.log('Tareas convertidas finales:', tareasConvertidas);
        console.log('Muestra de las primeras 5 tareas convertidas:', tareasConvertidas.slice(0, 5));
        setTareas(tareasConvertidas);
      } else if (Array.isArray(response.data)) {
        console.log('La respuesta de tareas es un array directo:', response.data);
        console.log('Muestra de las primeras 3 tareas sin procesar:', response.data.slice(0, 3));
        
        const tareasConvertidas = response.data.map((tarea: {
          id: number;
          nombreTarea?: string;
          descripcionTarea?: string;
          duracionTarea?: number;
          tipoServicio?: number | { id: number }; // Puede ser número directo o objeto
          tipoServicioId?: number;
          tipo_servicio_id?: number;
        }) => {
          console.log('Procesando tarea:', tarea);
          // Si tipoServicio es un número, usarlo directamente; si es objeto, usar .id
          let tipoServicioId: number;
          if (typeof tarea.tipoServicio === 'number') {
            tipoServicioId = tarea.tipoServicio;
          } else if (tarea.tipoServicio && typeof tarea.tipoServicio === 'object') {
            tipoServicioId = tarea.tipoServicio.id;
          } else {
            tipoServicioId = tarea.tipoServicioId || tarea.tipo_servicio_id || 0;
          }
          
          console.log(`Tarea ID ${tarea.id}: tipoServicioId calculado = ${tipoServicioId}`);
          
          return {
            id: tarea.id,
            descripcion: tarea.nombreTarea || tarea.descripcionTarea || `Tarea ${tarea.id}`,
            tipoServicioId: tipoServicioId,
            seleccionada: false,
            precio: 0,
            duracion: tarea.duracionTarea || 0
          };
        });
        setTareas(tareasConvertidas);
      } else {
        console.error('Estructura de respuesta de tareas inesperada:', response);
      }
    } catch (err) {
      console.error('Error cargando tareas:', err);
      // No mostramos error para tareas, solo logueamos
    }
  }, []);

  // Cargar servicios existentes del usuario
  const cargarServiciosExistentes = useCallback(async () => {
    if (!usuario) return;
    
    try {
      console.log('Iniciando carga de servicios existentes para usuario:', usuario.id);
      const response = await serviciosApi.getByUser(usuario.id);
      
      console.log('Respuesta de servicios existentes:', response);
      
      if (response.data && response.data.data) {
        const serviciosExistentes = response.data.data;
        console.log('Servicios existentes:', serviciosExistentes);
        
        // Extraer información de los servicios
        const tiposConServicios = new Set<number>(); // Tipos que tienen cualquier servicio (activo o inactivo)
        const tareasConPrecios = new Map<number, number>(); // tareaId -> precio
        const tareasActivas = new Map<number, boolean>(); // tareaId -> isActive
        
        serviciosExistentes.forEach((servicio: {
          tarea?: { id: number; tipoServicio?: { id: number } } | number;
          precio: number;
          estado?: string;
        }) => {
          const tareaId = typeof servicio.tarea === 'object' ? servicio.tarea?.id : servicio.tarea;
          const tipoServicioId = typeof servicio.tarea === 'object' ? servicio.tarea?.tipoServicio?.id : undefined;
          const precio = servicio.precio;
          const isActive = servicio.estado === 'activo';
          
          if (tareaId && precio) {
            tareasConPrecios.set(tareaId, precio);
            tareasActivas.set(tareaId, isActive);
          }
          
          // Marcar tipos como activos si tienen cualquier servicio (activo o inactivo)
          if (tipoServicioId) {
            tiposConServicios.add(tipoServicioId);
          }
        });
        
        console.log('Tipos con servicios extraídos:', Array.from(tiposConServicios));
        console.log('Tareas con precios:', Array.from(tareasConPrecios.entries()));
        console.log('Tareas activas:', Array.from(tareasActivas.entries()));
        
        // Actualizar tipos de servicio (marcar como activos si tienen cualquier servicio)
        setTiposServicio(prev => 
          prev.map(tipo => ({
            ...tipo,
            activo: tiposConServicios.has(tipo.id)
          }))
        );
        
        // Actualizar tareas (marcar como seleccionadas según su estado y establecer precios)
        setTareas(prev => 
          prev.map(tarea => ({
            ...tarea,
            seleccionada: tareasActivas.get(tarea.id) || false, // true solo si está activa
            precio: tareasConPrecios.get(tarea.id) || 0
          }))
        );
        
        console.log('Estados actualizados con servicios existentes');
      }
    } catch (err) {
      console.error('Error cargando servicios existentes:', err);
      // No mostramos error, solo logueamos
    }
  }, [usuario]);

  // Cargar datos iniciales al montar el componente
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      await cargarTiposServicio();
      await cargarTareas();
      // Cargar servicios existentes después de cargar tipos y tareas
      if (usuario) {
        await cargarServiciosExistentes();
      }
    };
    
    cargarDatosIniciales();
  }, [cargarTiposServicio, cargarTareas, cargarServiciosExistentes, usuario]);

  // Actualizar tareas visibles cuando cambian los tipos de servicio activos o el tipo activo
  useEffect(() => {
    const tiposActivos = tiposServicio.filter(tipo => tipo.activo).map(tipo => tipo.id);
    
    // Si no hay tipo de servicio activo seleccionado, usar el primero disponible
    if (tipoServicioActivo === null && tiposActivos.length > 0) {
      setTipoServicioActivo(tiposActivos[0]);
      return;
    }
    
    // Si el tipo activo ya no está seleccionado, cambiar al primero disponible
    if (tipoServicioActivo !== null && !tiposActivos.includes(tipoServicioActivo)) {
      setTipoServicioActivo(tiposActivos.length > 0 ? tiposActivos[0] : null);
      return;
    }
    
    // Filtrar tareas solo para el tipo de servicio activo
    let nuevasTareasVisibles: Tarea[] = [];
    if (tipoServicioActivo !== null && tiposActivos.includes(tipoServicioActivo)) {
      nuevasTareasVisibles = tareas.filter(tarea => tarea.tipoServicioId === tipoServicioActivo);
    }
    
    console.log(`Mostrando tareas para tipo de servicio ${tipoServicioActivo}:`, nuevasTareasVisibles);
    setTareasVisibles(nuevasTareasVisibles);
  }, [tiposServicio, tareas, tipoServicioActivo]);

  const handleTipoServicioChange = async (tipoId: number) => {
    if (!usuario) {
      setAlertType('danger');
      setAlertMessage('Error: Usuario no autenticado');
      setShowAlert(true);
      return;
    }

    console.log(`=== Cambiando estado del tipo de servicio ${tipoId} ===`);
    
    // Encontrar el tipo de servicio actual
    const tipoActual = tiposServicio.find(tipo => tipo.id === tipoId);
    if (!tipoActual) return;

    const seraDesactivado = tipoActual.activo; // Si está activo, será desactivado

    // Actualizar el estado del tipo de servicio
    setTiposServicio(prev => {
      const nuevosTimpos = prev.map(tipo => 
        tipo.id === tipoId ? { ...tipo, activo: !tipo.activo } : tipo
      );
      console.log('Nuevos tipos de servicio:', nuevosTimpos);
      return nuevosTimpos;
    });

    // Si se está desactivando el tipo, desactivar automáticamente todos los servicios relacionados
    if (seraDesactivado) {
      console.log(`Desactivando servicios del tipo ${tipoId}`);
      
      // Encontrar todas las tareas relacionadas con este tipo
      const tareasDelTipo = tareas.filter(tarea => tarea.tipoServicioId === tipoId);
      
      if (tareasDelTipo.length > 0) {
        try {
          // Desactivar servicios en el backend
          await Promise.allSettled(
            tareasDelTipo.map(async (tarea) => {
              try {
                await serviciosApi.deactivateByUserAndTask(usuario.id, tarea.id);
                console.log(`Servicio desactivado: Usuario ${usuario.id}, Tarea ${tarea.id}`);
              } catch (error) {
                console.warn(`Error al desactivar servicio (Usuario ${usuario.id}, Tarea ${tarea.id}):`, error);
                // Ignorar errores - probablemente el servicio no existía
              }
            })
          );

          // Actualizar estado local - marcar como no seleccionadas
          setTareas(prev => 
            prev.map(tarea => 
              tarea.tipoServicioId === tipoId 
                ? { ...tarea, seleccionada: false }
                : tarea
            )
          );

          setAlertType('success');
          setAlertMessage(`✅ Tipo de servicio desactivado. Servicios relacionados han sido desactivados automáticamente.`);
          setShowAlert(true);
        } catch (error) {
          console.error('Error al desactivar servicios automáticamente:', error);
          setAlertType('danger');
          setAlertMessage('⚠️ Tipo desactivado, pero hubo problemas al desactivar algunos servicios. Revisa el estado individual.');
          setShowAlert(true);
        }
      }
    }
  };

  const handleTareaChange = (tareaId: number, campo: 'seleccionada' | 'precio', valor: boolean | number) => {
    setTareas(prev => 
      prev.map(tarea => 
        tarea.id === tareaId ? { ...tarea, [campo]: valor } : tarea
      )
    );
  };

  // Función para activar/desactivar tareas individualmente
  const handleActivateDeactivate = async (tareaId: number, activate: boolean) => {
    if (!usuario) {
      setAlertType('danger');
      setAlertMessage('Error: Usuario no autenticado');
      setShowAlert(true);
      return;
    }

    const tarea = tareas.find(t => t.id === tareaId);
    if (!tarea) return;

    // Si está activando, necesita un precio
    if (activate && tarea.precio <= 0) {
      setAlertType('danger');
      setAlertMessage('Debes asignar un precio mayor a 0 antes de activar la tarea');
      setShowAlert(true);
      return;
    }

    try {
      if (activate) {
        // Activar: crear/actualizar servicio
        await serviciosApi.upsertByUserAndTask({
          tareaId: tarea.id,
          usuarioId: usuario.id,
          precio: tarea.precio
        });
        // Actualizar estado local
        handleTareaChange(tareaId, 'seleccionada', true);
        setAlertType('success');
        setAlertMessage('✅ Tarea activada exitosamente');
      } else {
        // Desactivar: cambiar estado a inactivo
        await serviciosApi.deactivateByUserAndTask(usuario.id, tarea.id);
        // Actualizar estado local
        handleTareaChange(tareaId, 'seleccionada', false);
        setAlertType('success');
        setAlertMessage('✅ Tarea desactivada exitosamente');
      }
      setShowAlert(true);
    } catch (error) {
      console.error('Error al activar/desactivar tarea:', error);
      setAlertType('danger');
      setAlertMessage('❌ Error al actualizar la tarea. Intenta nuevamente.');
      setShowAlert(true);
    }
  };

  // Función para actualizar solo el precio de una tarea activa
  const handlePriceUpdate = async (tareaId: number, nuevoPrecio: number) => {
    if (!usuario) {
      setAlertType('danger');
      setAlertMessage('Error: Usuario no autenticado');
      setShowAlert(true);
      return;
    }

    const tarea = tareas.find(t => t.id === tareaId);
    if (!tarea || !tarea.seleccionada) {
      setAlertType('danger');
      setAlertMessage('Solo se puede actualizar el precio de tareas activas');
      setShowAlert(true);
      return;
    }

    if (nuevoPrecio <= 0) {
      setAlertType('danger');
      setAlertMessage('El precio debe ser mayor a 0');
      setShowAlert(true);
      return;
    }

    try {
      // Actualizar el precio usando el mismo endpoint de upsert
      await serviciosApi.upsertByUserAndTask({
        tareaId: tarea.id,
        usuarioId: usuario.id,
        precio: nuevoPrecio
      });
      
      setAlertType('success');
      setAlertMessage('✅ Precio actualizado exitosamente');
      setShowAlert(true);
    } catch (error) {
      console.error('Error al actualizar precio:', error);
      setAlertType('danger');
      setAlertMessage('❌ Error al actualizar el precio. Intenta nuevamente.');
      setShowAlert(true);
    }
  };

  // Función para guardar cambios por tipo de servicio
  return (
    <DashboardSection>
      <StripeConnection loadingMessage="Cargando configuración de servicios...">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Mis Servicios</h2>
          </div>

        {/* Selector de Tipos de Servicio */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-left">Tipos de Servicio</h3>
          
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
              <h3 className="text-lg font-semibold text-gray-900 text-left">
                Tareas
              </h3>
            </div>

            {/* Navegación por tipos de servicio */}
            {tiposServicio.filter(tipo => tipo.activo).length > 1 && (
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-wrap gap-2">
                  {tiposServicio
                    .filter(tipo => tipo.activo)
                    .map((tipo) => (
                      <button
                        key={tipo.id}
                        onClick={() => setTipoServicioActivo(tipo.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          tipoServicioActivo === tipo.id
                            ? 'bg-orange-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tipo.nombre}
                        {(() => {
                          const tareasDelTipo = tareas.filter(t => t.tipoServicioId === tipo.id && t.seleccionada);
                          return tareasDelTipo.length > 0 ? ` (${tareasDelTipo.length})` : '';
                        })()}
                      </button>
                    ))}
                </div>
              </div>
            )}
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
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
                      <TareaRow
                        key={tarea.id}
                        tarea={tarea}
                        tipoServicio={tipoServicio}
                        onTareaChange={handleTareaChange}
                        onActivateDeactivate={handleActivateDeactivate}
                        onPriceUpdate={handlePriceUpdate}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mensaje cuando no hay tipos seleccionados o no hay tareas */}
        {tiposServicio.filter(tipo => tipo.activo).length === 0 ? (
          <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            <div className="mx-auto w-12 h-12 text-gray-400 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No hay tipos de servicio seleccionados</h3>
            <p className="text-gray-500 mb-4">
              Selecciona al menos un tipo de servicio arriba para ver las tareas disponibles.
            </p>
          </div>
        ) : tareasVisibles.length === 0 && tipoServicioActivo !== null && (
          <div className="bg-blue-50 rounded-lg border-2 border-dashed border-blue-300 p-8 text-center">
            <div className="mx-auto w-12 h-12 text-blue-400 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No hay tareas disponibles</h3>
            <p className="text-gray-500">
              No se encontraron tareas para el tipo de servicio "{tiposServicio.find(tipo => tipo.id === tipoServicioActivo)?.nombre}".
            </p>
          </div>
        )}

        {/* Alert de confirmación */}
        {showAlert && (
          <Alert
            variant={alertType}
            onClose={() => setShowAlert(false)}
            autoClose={true}
            autoCloseDelay={5000}
          >
            <AlertDescription>
              {alertMessage}
            </AlertDescription>
          </Alert>
        )}
      </div>
      </StripeConnection>
    </DashboardSection>
  );
}

export default ServiciosSection;
