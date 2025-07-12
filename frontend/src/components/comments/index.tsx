import style from './comments.module.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

type Props = {
  id: number;
};
type Turno = {
  comentario: string;
  calificacion: number;
  usuario: {
    nombre: string;
    foto: string;
  };
};
function Comments({ id }: Props) {
  const [comments, setComments] = useState<Turno | null>(null);
  useEffect(() => {
    axios
      .get<{ data: Turno }>(`/turno/${id}`)
      .then((res) => setComments(res.data.data))
      .catch((err) => console.error('Error al cargar comentarios:', err));
  }, [id]);
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < (comments?.calificacion ?? 0)) {
      stars.push(
        <img key={`full-${i}`} src="/full-star.png" alt="estrella llena" />
      );
    } else {
      stars.push(
        <img key={`empty-${i}`} src="/empty-star.png" alt="estrella vacía" />
      );
    }
  }
  return (
    <div className={style.comments}>
      <img src={comments?.usuario.foto} alt="foto de perfil de usuario" />
      <h2>{comments?.usuario.nombre}</h2>
      {stars}
      <p>{comments?.comentario}</p>
    </div>
  );
}

export default Comments;
