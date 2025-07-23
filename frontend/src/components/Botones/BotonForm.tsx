import styles from './Botones.module.css';
type Props = {
  texto: string;
  accion?: (event: React.FormEvent<HTMLFormElement>) => void;
  tipo: 'submit' | 'reset' | 'button';
};
export default function BotonForm({ texto, accion, tipo }: Props) {
  const handleClick = (event: React.FormEvent<HTMLFormElement>) => {
    if (accion) accion(event);
  };
  return (
    <button onClick={handleClick} className={styles.BotonForm} type={tipo}>
      {texto}
    </button>
  );
}
