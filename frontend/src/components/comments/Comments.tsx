import Stars from '../stars/Stars';
import { useState, useEffect } from 'react';
import { turnosApi } from '../../services/turnosApi';
import { serviciosApi } from '../../services/serviciosApi';
type Props = {
  id: number;
};

type Turno = {
  usuario?: {
    nombre: string;
    fotoPerfil: string;
  };
  servicio?: {
    id: number;
  };
  comentario?: string;
  calificacion?: number;
};
type Servicio = {
  id: number;
  precio: number;
  usuarios: {
    id: number;
    nombre: string;
  };
};

function Comments({ id }: Props) {
  const [turno, setTurno] = useState<Turno | null>(null);
  const [servicio, setServicio] = useState<Servicio | null>(null);

  useEffect(() => {
    const getTurno = async (id: number) => {
      try {
        const res = await turnosApi.getById(String(id));
        setTurno(res.data.data);
      } catch (error) {
        console.error('Error al cargar turno:', error);
      }
    };
    getTurno(id);
  }, [id]);

  const idService = turno?.servicio?.id;

  useEffect(() => {
    const getServicio = async (id: number) => {
      try {
        const res = await serviciosApi.getById(id.toString());
        setServicio(res.data.data);
      } catch (error) {
        console.error('Error al cargar servicio:', error);
      }
    };
    if (idService !== undefined) {
      getServicio(idService);
    }
  }, [idService]);

  const fotoUser = turno?.usuario?.fotoPerfil || '../images/fotoUserId.png';
  const nombreUser = turno?.usuario?.nombre || 'Nombre Usuario';
  const comentarioText = turno?.comentario || 'Comentario no disponible';
  const calificacion = turno?.calificacion || 3;

  const nombrePrestatario =
    Array.isArray(servicio?.usuarios) && servicio.usuarios.length > 0
      ? servicio.usuarios[0].nombre
      : 'Nombre Prestatario'; // despues hay que cambiarlo porq ahora es una array de usuarios porq esta mal la base de datos
  return (
    <div className="mx-auto mt-6 rounded-xl bg-white shadow-[0_0_30px_0_rgba(0,0,0,0.1)] p-3 h-auto pb-0 w-full">
      <div className="flex items-center flex-row w-11/12 justify-between mb-2.5 ">
        <div className="flex flex-row items-center max-w-[90%] max-h-[13%]">
          <img
            className="w-12 h-12 rounded-full mr-3 "
            src={fotoUser}
            alt="foto de perfil de usuario"
          />
          <h2 className="text-black">{nombreUser}</h2>
        </div>
        <div className="flex flex-row-reverse items-center max-w-24 max-h-16">
          <Stars cant={calificacion} />
        </div>
      </div>

      <p className="text-black">{comentarioText}</p>
      <div className="w-full flex flex-row m-2/100">
        <p className="mt-3 pb-2 text-gray-500 text-xs">
          {' '}
          Reseña al prestatario: {nombrePrestatario}
        </p>
      </div>
    </div>
  );
}

export default Comments;
