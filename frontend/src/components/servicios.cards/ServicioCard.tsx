import Boton from '../Botones/BotonServicios.tsx';
import './../../index.css';
import Stars from '../stars/Stars';
import { useNavigate } from 'react-router-dom';

type Props = {
  id: number;
  nombre: string;
  rubros: string;
  puntuacion: number;
};
export default function ServicioCard({
  id,
  nombre,
  rubros,
  puntuacion,
}: Props) {
  const handleClick = () => {
    navigate(`/borrower/${id}`);
  };
  const navigate = useNavigate();
  return (
    <div
      className={
        ' w-76 min-w-76 max-w-76 mx-auto rounded-3xl flex-shrink-0 flex-grow-0 border-2 py-5 px-8 border-secondary h-5/12 min-h-5/12 max-h-5/12 bg-white shadow-2xl hover:border-gray-700 transition duration-400  hover:bg-gray-100 hover:scale-102 flex flex-col'
      }
      key={id}
    >
      <img
        src="./../../public/images/SantiagoMalet.png"
        alt="Foto de Perfil"
        className={'w-26 h-26 rounded-full mx-auto mt-2 mb-3'}
      />
      <div className="flex flex-col flex-grow">
        <p
          className={
            'text-secondary text-center break-before-all text-3xl mb-4 font-bold  h-16 min-h-16 max-h-16'
          }
        >
          {nombre}
        </p>
        <p
          className={
            'text-gray-700 text-center break-normal text-lg font-normal mb-8 h-18'
          }
        >
          {rubros}
        </p>
        <div className="flex-grow mt-2"></div>
        <Stars cant={puntuacion} />
      </div>
      <Boton
        texto="CONTRATAR"
        estilosExtras="mt-4 mb-2"
        contactar={handleClick}
      />
    </div>
  );
}
