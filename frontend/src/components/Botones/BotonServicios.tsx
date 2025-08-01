import './../../index.css';
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
    <button
      onClick={handeClick}
      className={
        'bg-naranja-1 text-white text-center py-2 px-4 rounded-md hover:bg-white ' +
        'hover:border-naranja-1 hover:border-2 hover:text-naranja-1 hover:text-primary transition duration-300 '
      }
    >
      {texto}
    </button>
  );
}
