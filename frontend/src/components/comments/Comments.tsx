import style from './comments.module.css';
import Stars from '../stars/Stars.js';
function Comments() {
  return (
    <div className={style.comments}>
      <div className={style.firstLine}>
        <div className={style.userGroup}>
          <img
            className={style.userImage}
            src={'./images/fotoUserId.png'}
            alt="foto de perfil de usuario"
          />
          <h2 className={style.userName}>juan perez</h2>
        </div>
        <div className={style.lineStars}>
          <Stars cant={3} />
        </div>
      </div>
      <p className={style.commentText}>
        La verdad el servicio me encanto, pedí un plomero para mi casa urgente y
        no solo vino rápido si no que de que me resolvió el tema rapido y
        sencillo. Lo volvería a contratar
      </p>
      <div className={style.footer}>
        <p className={style.footerText}>Reseña al plomero agustin dana </p>
      </div>
    </div>
  );
}

export default Comments;
