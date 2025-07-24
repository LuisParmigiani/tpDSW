import style from './comments.module.css';
import Stars from '../stars/Stars';
import { useState, useEffect } from 'react';
import { apiServices } from '../../services/api';

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
        const res = await apiServices.turnos.getById(String(id));
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
        const res = await apiServices.servicios.getById(id.toString());
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
    <div className={style.comments}>
      <div className={style.firstLine}>
        <div className={style.userGroup}>
          <img
            className={style.userImage}
            src={fotoUser}
            alt="foto de perfil de usuario"
          />
          <h2 className={style.userName}>{nombreUser}</h2>
        </div>
        <div className={style.lineStars}>
          <Stars cant={calificacion} />
        </div>
      </div>

      <p className={style.commentText}>{comentarioText}</p>
      <div className={style.footer}>
        <p className={style.footerText}>
          {' '}
          Reseña al prestatario: {nombrePrestatario}
        </p>
      </div>
    </div>
  );
}

export default Comments;
