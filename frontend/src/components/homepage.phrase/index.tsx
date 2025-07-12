import style from './homepage.phrase.module.css';

function HomepagePhrase() {
  return (
    <div className={style.phrase}>
      <h2 className={style.title}>
        La solucion de tus <span className={style.highlight}>problemas</span>,{' '}
        <br /> al alcance de un
        <span className={style.highlight}> click</span>.
      </h2>
      <img
        className={style.arrow}
        src="/images/down-arrow.png"
        alt="Flecha para abajo"
      />
    </div>
  );
}

export default HomepagePhrase;
