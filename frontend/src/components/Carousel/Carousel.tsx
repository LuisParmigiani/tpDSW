import { useState, useEffect } from 'react';
import styles from './Carousel.module.css';

type Props = {
  fotos: string[];
  titulo: string | undefined;
};

function Carousel({ fotos, titulo }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) =>
        prevIndex < fotos.length - 1 ? prevIndex + 1 : 0
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [fotos.length]);

  return (
    <div className={styles.carousel}>
      <img
        className={styles.carouselImg}
        src={fotos[index]}
        alt="Foto Trabajador"
      />
      <h1 className={styles.carouselh1}>{titulo}</h1>
    </div>
  );
}

export default Carousel;
