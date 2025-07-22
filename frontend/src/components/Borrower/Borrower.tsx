import { useEffect, useState } from 'react';
import Comments from '../comments/Comments';
import axios from 'axios';
import styles from './Borrower.module.css';
import Navbar from '../navBar/Navbar';
import Stars from '../stars/Stars';
import Footer from '../Footer/Footer';
import Pagination from '../Pagination/Pagination';

type Props = {
  id: number;
};

type Turno = {
  id: number;
  fecha: string;
  hora: string;
  servicio: string;
  calificacion: number;
};

type Usuario = {
  nombre: string;
  apellido: string;
  foto: string;
  mail: string;
  telefono: string;
};

function Borrower(props: Props) {
  const { id } = props;
  // Se busca el prestatario y sus comentarios
  const [prestatario, setPrestatario] = useState<Usuario | null>(null);
  const [borrower, setBorrower] = useState<Turno[] | null>(null);

  useEffect(() => {
    axios
      .get(`/api/usuario/${id}`)
      .then((res) => setPrestatario(res.data.data))
      .catch((err) => console.error('Error al cargar prestatario:', err));
  }, [id]);

  useEffect(() => {
    axios
      .get(`/api/usuario/comments/${id}`)
      .then((res) => setBorrower(res.data.data))
      .catch((err) => console.error('Error al cargar comentarios:', err));
  }, [id]);

  // Se muestran los comentarios del prestatario
  const commentToShow = [];
  let totalStars = 0;
  if (!borrower) {
    commentToShow.push(<p>Cargando comentarios...</p>);
  } else {
    borrower.map((comment) => {
      totalStars += comment.calificacion;
      commentToShow.push(<Comments key={comment.id} id={comment.id} />);
    });
  }

  // Se muestra la cantidad de reseñas
  let cantComments;
  if (borrower?.length === 0) {
    cantComments = <p></p>;
  } else if (borrower?.length === 1) {
    cantComments = <p className={styles.cantComments}> 1 reseña</p>;
  } else {
    cantComments = (
      <p className={styles.cantComments}>Hay {borrower?.length} reseñas.</p>
    );
  }
  // Se calcula el promedio de estrellas

  const starAverage =
    borrower && borrower.length > 0 ? totalStars / borrower.length : 0;
  let starAverageShow;
  if (starAverage === 0) {
    starAverageShow = <p> aun no hay calificaciones</p>;
  } else {
    starAverageShow = <Stars cant={Math.round(starAverage)} />;
  }

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.containerUser}>
          <img
            className={styles.userImage}
            src={'../images/fotoUserId.png'}
            alt="foto de perfil del prestatario"
          />
          <div className={styles.userInformation}>
            <h2>{prestatario?.nombre}</h2>
            <p>Email: {prestatario?.mail}</p>
            <p>Teléfono: {prestatario?.telefono}</p>
            <div className={styles.starsContainer}>
              <div className={styles.starsFoto}>{starAverageShow}</div>
              {cantComments}
            </div>
            <button className={styles.contactButton}>Contactar</button>
          </div>
        </div>
        <div className={styles.commentsContainer}>
          <Pagination
            elements={commentToShow}
            maxElementsPerPage={5}
            showInfo={true}
            title="Comentarios"
          />
        </div>
        <Footer />
      </div>
    </>
  );
}
export default Borrower;
