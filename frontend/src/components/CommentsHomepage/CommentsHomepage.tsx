import Comments from '../Comments/Comments.js';
import style from './CommentsHomepage.module.css';
function CommentsHomepage() {
  return (
    <>
      <h1 className={style.phrase}>
        No nos escuches a nosotros, escucha a nuestros{' '}
        <span className={style.word}>clientes.</span>
      </h1>
      <div className={style.container}>
        <div className={style.commentOne}>
          <Comments />
        </div>
        <div className={style.commentTwo}>
          <Comments />
        </div>
      </div>
    </>
  );
}

export default CommentsHomepage;
