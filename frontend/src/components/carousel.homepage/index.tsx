import { useState, useEffect } from 'react';
import styles from './CarouselHomepage.module.css';

function CarouselHomepage() {
  const fotos = [
    '/images/carousel1.jpg',
    '/images/carousel2.jpg',
    '/images/carousel.jpg',
  ];
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
      <h1 className={styles.carouselh1}>Nombre de la empresa</h1>
    </div>
  );
}

export default CarouselHomepage;
