import style from './Stars.module.css';

type Props = {
  cant: number;
};
function Stars({ cant }: Props) {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < cant) {
      stars.push(
        <img
          key={`full-${i}`}
          className={style.star}
          src="../images/full-star.png"
          alt="estrella llena"
        />
      );
    } else {
      stars.push(
        <img
          key={`empty-${i}`}
          className={style.star}
          src="../images/empty-star.png"
          alt="estrella vacía"
        />
      );
    }
  }
  return <div className={style.starsContainer}>{stars}</div>;
}

export default Stars;
