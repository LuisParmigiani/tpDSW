import Boton from '../Botones/BotonServicios.tsx';
import './../../index.css';
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
  const contactar = () => {};
  //const rubrosPersona = rubros.join(', '); // Convert array to string
  console.log(rubros);
  return (
    <div
      className={
        'flex flex-col w-64 h-1/3 align-middle gap-1 rounded-3xl border-2 py-5 px-8 border-secondary bg-white shadow-2xl hover:border-grey-700 transition-duration-500 hover:scale-102'
      }
      key={id}
    >
      <img
        src="./../../public/images/SantiagoMalet.png"
        alt="Foto de Perfil"
        className={'w-24 h-24 rounded-full mx-auto mb-4'} // Adjust size as needed
      />
      <span className={''}>
        <p className={'text-secondary text-center text-3xl font-bold'}>
          {nombre}
        </p>
        <p className={'text-gray-700 text-center text-lg font-normal '}>
          {rubros}
        </p>
      </span>
      <div className={'text-blue-950'}>{puntuacion}</div>
      <Boton texto="HORARIOS" contactar={contactar}></Boton>
    </div>
  );
}
