import DashboardSection from '../DashboardSection/DashboardSection';
import { useState, useEffect } from 'react';
import { usuariosApi } from '../../services/usuariosApi';
import Comments from '../Comments/Comments';
//import useAuth from '../../cookie/useAuth';
import type { Turno } from '../../components/Comments/Comments';

function ComentariosPrestadorSection() {
  //const { usuario } = useAuth();
  const [comentariosIds, setComentariosIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar comentarios desde el API
  const cargarComentarios = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Por ahora usar el ID 46 como solicitaste
      const prestadorId = '46'; // usuario?.id?.toString() ||;
      
      console.log('Cargando comentarios para prestador ID:', prestadorId);
      
      const response = await usuariosApi.getCommentsByUserId(
        prestadorId,
        '50', // máximo 50 comentarios
        '1',  // página 1
        'fechaCreacion_desc' // ordenar por fecha descendente
      );
      
      console.log('Respuesta de la API:', response.data);
      
      // Extraer los IDs de los turnos/comentarios
      const comentarios = response.data.data || [];
      const ids = comentarios.map((comentario: Turno) => comentario.servicio.id).filter((id: number) => id);
      
      console.log('IDs de comentarios encontrados:', ids);
      
      setComentariosIds(ids);
      
    } catch (err) {
      console.error('Error al cargar comentarios:', err);
      setError('Error al cargar los comentarios. Por favor, intenta nuevamente.');
      setComentariosIds([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar comentarios al montar el componente
  useEffect(() => {
    cargarComentarios();
  }, []);

  if (loading) {
    return (
      <DashboardSection title="Mis Comentarios">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="ml-2 text-gray-600">Cargando comentarios...</span>
        </div>
      </DashboardSection>
    );
  }

  if (error) {
    return (
      <DashboardSection title="Mis Comentarios">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={cargarComentarios}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </DashboardSection>
    );
  }

  return (
    <DashboardSection title="Mis Comentarios">
      <div className="space-y-4">
        {comentariosIds.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No tienes comentarios aún.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600 mb-4">
              Total de comentarios: {comentariosIds.length}
            </p>
            {comentariosIds.map((id) => (
              <Comments key={id} id={id} />
            ))}
          </div>
        )}
      </div>
    </DashboardSection>
  );
}

export default ComentariosPrestadorSection;
