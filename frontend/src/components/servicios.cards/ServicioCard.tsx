import styles from './ServicioCard.module.css';
import Boton from '../Botones/BotonServicios.tsx';
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
  const contactar = () => {
    alert(`Contactando a ${nombre}`);
  };
  //const rubrosPersona = rubros.join(', '); // Convert array to string
  return (
    <div className={styles.ServicioCard} key={id}>
      <img
        src="./../../public/images/SantiagoMalet.png"
        alt="Foto de Perfil"
        className={styles.FotoPerfil}
      />
      <span className={styles.Info}>
        <p className={styles.Nombre}>{nombre}</p>
        <p className={styles.Rubros}>{rubros}</p>
      </span>
      <div className={styles.puntuacion}>{puntuacion}</div>
      <Boton texto="CONTACTAR" contactar={contactar}></Boton>
    </div>
  );
}
