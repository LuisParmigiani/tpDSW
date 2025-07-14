import Navbar from '../Navbar/Navbar.js';
import CarouselHomepage from '../CarouselHomepage/CarouselHomepage.js';
import styles from './NavbarHomepage.module.css';

type Props = {
  id?: number;
};

function NavbarCarouselHomepage({ id }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.navBarContainer}>
        <Navbar id={id} />
      </div>
      <div className={styles.carouselContainer}>
        <CarouselHomepage />
      </div>
    </div>
  );
}
export default NavbarCarouselHomepage;
