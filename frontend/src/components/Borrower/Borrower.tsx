import { useEffect, useState } from 'react';
import Comments from '../comments/Comments';
import { apiServices } from '../../services/api.js';
import styles from './Borrower.module.css';
import Navbar from '../navBar/Navbar';
import Stars from '../stars/Stars';
import Footer from '../Footer/Footer';
import PaginationControls from '../Pagination/PaginationControler.js';

type Props = {
  id: number;
};

type Turno = {
  id: number;
  fechaHora: string;
  servicio: string;
  calificacion: number;
};

type Usuario = {
  nombre: string;
  apellido: string;
  foto: string;
  mail: string;
  telefono: string;
  tiposDeServicio: {
    nombreTipo: string;
  }[];
};

function Borrower(props: Props) {
  const { id } = props;
  // variable de prestatario para mostrar en la card de usuario y Buscar sus comentarios de cada servicio
  const [prestatario, setPrestatario] = useState<Usuario | null>(null);
  // Se guarda la informacion de los comentarios del prestatario, incluyendo el promedio de estrellas y la cantidad de comentarios
  const [borrower, setBorrower] = useState<Turno[] | null>(null); // Comentarios del prestatario
  const [average, setAverage] = useState(0); // Variable de promedio de estrellas
  // Variable para mostrar el cargando mientras se cargan los comentarios
  const [loading, setLoading] = useState(true);

  // Variable para poder ordenar los comentarios
  const [selectedValue, setSelectedValue] = useState('');
  // Variables de paginacion:
  const cantItemsPerPage = '5'; // Cantidad de comentarios por pagina
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas
  const [totalComments, setTotalComments] = useState(0); // Total de comentarios

  // Se carga la informacion del prestatario
  useEffect(() => {
    const pres = async (id: number) => {
      try {
        const res = await apiServices.usuarios.getById(id.toString());
        setPrestatario(res.data.data);
      } catch (err) {
        console.error('Error al cargar usuario:', err);
      }
    };
    pres(id);
  }, [id]);

  // Se cargan los comentarios del prestatario, promedio de estrellas y cantidad de comentarios
  useEffect(() => {
    const getComments = async (id: number) => {
      try {
        setLoading(true);
        const res = await apiServices.usuarios.getCommentsByUserId(
          String(id), // ID del usuario
          cantItemsPerPage, // Cantidad de comentarios por página
          currentPage.toString(), // Página actual
          selectedValue // Filtro de orden
        );
        setBorrower(res.data.data); // Comentarios del prestatario
        // Usar la información de paginación que viene del API
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.totalPages); // Total de páginas
          setTotalComments(res.data.pagination.totalComments); // Total de comentarios
        }
        if (res.data.average) {
          setAverage(res.data.average); // Promedio de estrellas
        }
      } catch (err) {
        console.error('Error al cargar comentarios:', err);
      } finally {
        setLoading(false);
      }
    };
    getComments(id);
  }, [id, currentPage, selectedValue]); // Cada que cambia el id de usuario, la página actual o el filtro de orden se vuelve a hacer la petición

  // Cambia el orden de los comentarios segun el filtro seleccionado
  const orderBy = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setSelectedValue(newValue);
    setCurrentPage(1); // Despues de cambiar el filtro vuelve a la primera página
  };

  // Se muestra el promedio de puntuacion en la card de usuario
  let cantComments;
  if (totalComments === 0) {
    cantComments = <p></p>;
  } else if (totalComments === 1) {
    cantComments = <p className={styles.cantComments}> 1 reseña</p>;
  } else {
    cantComments = (
      <p className={styles.cantComments}>Hay {totalComments} reseñas.</p>
    );
  }

  // se pone la cantidad de estrellas promedio en la card
  let starAverageShow;
  if (average === 0) {
    starAverageShow = <p> Aun no hay calificaciones</p>;
  } else {
    starAverageShow = <Stars cant={Math.round(average)} />;
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
            <p>
              Servicios:{' '}
              {prestatario?.tiposDeServicio
                .map((tipoServicio) => tipoServicio?.nombreTipo)
                .join(', ')}
            </p>
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
          <h1>Comentarios</h1>
          <div className={styles.orderBy}>
            <select
              className={styles.orderbybutton}
              value={selectedValue}
              onChange={orderBy}
            >
              <option className={styles.orderBYOption} value="">
                Ordenar por
              </option>
              <option className={styles.orderBYOption} value="new">
                Mas nuevo
              </option>
              <option className={styles.orderBYOption} value="old">
                Mas viejo
              </option>
              <option className={styles.orderBYOption} value="best">
                Mejor calificacion
              </option>
              <option className={styles.orderBYOption} value="worst">
                Peor calificacion
              </option>
            </select>
          </div>
          {loading ? (
            <p>Cargando comentarios...</p>
          ) : borrower && borrower.length > 0 ? (
            borrower.map((comment: Turno) => (
              <Comments key={comment.id} id={comment.id} />
            ))
          ) : (
            <p>No hay comentarios.</p>
          )}
        </div>
        {!loading && (
          <PaginationControls
            currentPage={currentPage} // ← Página actual
            totalPages={totalPages} // ← Total de páginas
            onPageChange={setCurrentPage} // ← Función para cambiar página
          />
        )}
        <Footer />
      </div>
    </>
  );
}
export default Borrower;
