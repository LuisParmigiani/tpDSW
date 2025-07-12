import NavBar from '../navBar';
import CarouselHomepage from '../carousel.homepage';
import styles from './navBar.homepage.module.css';

type Props = {
  id?: number;
};

function NavBarCarouselHomepage({ id }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.navBarContainer}>
        <NavBar id={id} />
      </div>
      <div className={styles.carouselContainer}>
        <CarouselHomepage />
      </div>
    </div>
  );
}
export default NavBarCarouselHomepage;
