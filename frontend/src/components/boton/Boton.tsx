import styles from './Boton.module.css';
type Props = {
  texto: string;
  contactar?: () => void;
};
export default function Boton({ texto, contactar }: Props) {
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
