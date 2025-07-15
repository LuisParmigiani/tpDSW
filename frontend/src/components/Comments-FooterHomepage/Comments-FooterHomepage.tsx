import CommentsHomepage from '../CommentsHomepage/CommentsHomepage.js';
import Footer from '../Footer/Footer.js';
import styles from './Comments-FooterHomepage.module.css';

function CommentsFooterHomepage() {
  return (
    <div className={styles.container}>
      <CommentsHomepage />
      <Footer />
    </div>
  );
}

export default CommentsFooterHomepage;
