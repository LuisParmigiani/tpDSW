import style from './comments.module.css';
import Stars from '../stars/Stars.js';
import { useState, useEffect } from 'react';
import axios from 'axios';
type Props = {
  id?: number;
};

type Turno = {
  usuario?: {
    nombre: string;
    fotoPerfil: string;
  };
  comentario?: string;
  calificacion?: number;
};
function Comments({ id }: Props) {
  const [turno, setTurno] = useState<Turno | null>(null);

  useEffect(() => {
    if (id) {
      axios
        .get<{ data: Turno }>(`/api/Turno/${id}`)
        .then((res) => setTurno(res.data.data))
        .catch((err) => console.error('Error al cargar Turno:', err));
    }
  }, [id]);
  const fotoUser = turno?.usuario?.fotoPerfil || './images/fotoUserId.png';
  const nombreUser = turno?.usuario?.nombre || 'Nombre Usuario';
  const comentarioText = turno?.comentario || 'Comentario no disponible';
  const prestatario =
    'no se como se hace para que se vea el nombre del prestatario';
  const calificacion = turno?.calificacion || 3;
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
        <p className={style.footerText}>Reseña al plomero {prestatario}</p>
      </div>
    </div>
  );
}

export default Comments;
