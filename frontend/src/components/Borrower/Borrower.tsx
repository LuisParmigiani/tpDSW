import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Comments from '../comments/Comments';
import { usuariosApi } from '../../services/usuariosApi';
import Navbar from '../Navbar/Navbar.tsx';
import Stars from '../stars/Stars';
import Footer from '../Footer/Footer';
import PaginationControls from '../Pagination/PaginationControler';
import NewTurnModal from '../Modal/NewTurnModal';

type Turno = {
  id: number;
  fechaHora: string;
  servicio: string;
  calificacion: number;
};

type Usuario = {
  id: number;
  nombre: string;
  apellido: string;
  foto: string;
  mail: string;
  telefono: string;
  tiposDeServicio: TipoDeServicio[];
  horarios: {
    dia: string;
    horaDesde: string;
    horaHasta: string;
  }[];
  servicios: Servicio[];
};
type TipoDeServicio = {
  id: number;
  nombreTipo: string;
};

type Servicio = {
  id: number;
  precio: number;
  tarea: Tarea;
};

type Tarea = {
  id: number;
  nombreTarea: string;
  descripcionTarea: string;
  duracion: number;
  tipoServicio: TipoDeServicio;
};

function Borrower() {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);
  // variable de prestatario para mostrar en la card de usuario y Buscar sus comentarios de cada servicio
  const [prestatario, setPrestatario] = useState<Usuario>();
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
  // variables del modal
  const [isOpen, setIsOpen] = useState(false);

  // Se carga la informacion del prestatario
  useEffect(() => {
    const pres = async (id: number) => {
      try {
        const res = await usuariosApi.getById(id.toString());
        setPrestatario(res.data.data);
      } catch (err) {
        console.error('Error al cargar usuario:', err);
      }
    };
    pres(numericId);
  }, [numericId]);

  // Se cargan los comentarios del prestatario, promedio de estrellas y cantidad de comentarios
  useEffect(() => {
    const getComments = async (id: number) => {
      try {
        setLoading(true);
        const res = await usuariosApi.getCommentsByUserId(
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
    getComments(numericId);
  }, [numericId, currentPage, selectedValue]); // Cada que cambia el id de usuario, la página actual o el filtro de orden se vuelve a hacer la petición

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
    cantComments = <p className="ml-6"> 1 reseña</p>;
  } else {
    cantComments = <p className="ml-6"> {totalComments} reseñas.</p>;
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
      {isOpen && prestatario && (
        <NewTurnModal prestatario={prestatario} setopen={setIsOpen} />
      )}
      <div className="flex flex-col items-center    ">
        <div className="lg:flex items-center h-11/12  px-8 py-10 bg-tinte-5 shadow-2xl mt-20 mb-30  lg:w-9/12 lg:h-100 rounded-2xl ">
          <img
            className="shadow-2xl rounded-xl object-cover  h-52 w-52 lg:h-auto lg:w-85 lg:mx-5"
            src={'../images/fotoUserId.png'}
            alt="foto de perfil del prestatario"
          />
          <div className="flex flex-col items-start justify-between pt-5  text-black h-full lg:ml-17 lg:w-3/5 lg:h-3/4 text-md">
            <h2 className="text-3xl font-bold lg:pt-0 pt-2">
              {prestatario?.nombre} {` `} {prestatario?.apellido}
            </h2>
            <p className="lg:p-0 pt-2">
              {prestatario?.tiposDeServicio
                .map((tipoServicio) => tipoServicio?.nombreTipo)
                .join(', ')}
            </p>
            <p className="lg:p-0 pt-2"> {prestatario?.mail}</p>
            <p className="lg:p-0 pt-2"> {prestatario?.telefono}</p>
            <div className="flex items-center max-h-3 lg:p-0 pt-4 w-full text-sm text-gray-500">
              <div className="flex items-start mr-4 ">{starAverageShow}</div>
              {cantComments}
            </div>
            <button
              onClick={() => {
                setIsOpen(true);
              }}
              className="bg-naranja-1  mt-7 border-none rounded-4xl text-white px-17 py-2 hover:bg-neutral-200 border-2 border-naranja-1  hover:text-naranja-1 transition-colors duration-300"
            >
              Contratar
            </button>
          </div>
        </div>
        <div className="w-9/12 justify-between">
          <h1 className="text-4xl font-bold mb-7 text-black">Comentarios</h1>
          <div className="flex justify-start mb-6 min-h-4/5 ">
            <select
              className="bg-naranja-2 py-2 px-5 rounded-3xl "
              value={selectedValue}
              onChange={orderBy}
            >
              <option className="bg-gray-400 border-0" value="">
                Ordenar por
              </option>
              <option className="bg-gray-400 border-0" value="new">
                Mas nuevo
              </option>
              <option className="bg-gray-400  border-0" value="old">
                Mas viejo
              </option>
              <option className="bg-gray-400 border-0" value="best">
                Mejor calificacion
              </option>
              <option className="bg-gray-400 border-0" value="worst">
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
