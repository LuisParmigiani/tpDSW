import styles from './Botones.module.css';
type Props = {
  texto: string;
  contactar?: () => void;
};
export default function BotonServicios({ texto, contactar }: Props) {
  const handeClick = () => {
    if (contactar) contactar();
    else alert('Botón presionado');
  };
  return (
    <button onClick={handeClick} className={styles.Boton}>
      {texto}
    </button>
  );
}
