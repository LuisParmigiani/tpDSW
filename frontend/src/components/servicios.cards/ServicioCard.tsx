import styles from './ServicioCard.module.css';
type Props = {
  id: number;
  nombre: string;
  rubros: string[];
  puntuacion: number;
};
export default function ServicioCard({
  id,
  nombre,
  rubros,
  puntuacion,
}: Props) {
  const rubrosPersona = rubros.join(', '); // Convert array to string
  return (
    <div className={styles.ServicioCard} key={id}>
      <img
        src="./../../public/images/SantiagoMalet.png"
        alt="Foto de Perfil"
        className={styles.FotoPerfil}
      />
      <span className={styles.Info}>
        <p className={styles.Nombre}>{nombre}</p>
        <p className={styles.Rubros}>{rubrosPersona}</p>
      </span>
      <div className={styles.puntuacion}>{puntuacion}</div>
      <button className={styles.Boton}>Contactar</button>
    </div>
  );
}
