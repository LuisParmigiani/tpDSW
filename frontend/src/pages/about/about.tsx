import styles from './about.module.css';
import Navbar from '../../components/Navbar/Navbar.tsx';
import AboutContainer from '../../components/AboutContainer/index';
const text1 =
  'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maiores quisquam dolorum blanditiis excepturi architecto eligendi a assumenda, repellat, ad dolorem omnis quasi sunt impedit ipsum adipisci! Nostrum id alias excepturi.';
const text2 =
  'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cupiditate ipsam possimus at aliquid doloremque, quod quas reiciendis consequatur nihil temporibus ipsa iste, ut, qui quaerat. Possimus, odio ea soluta quibusdam harum voluptate inventore debitis commodi aliquid?';
const text3 =
  'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde, vero enim? Ut unde ab consequuntur, est sequi, quidem voluptatibus voluptas magnam iste delectus, assumenda debitis.';
function About() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.navBarContainer}>
          <Navbar />
        </div>
        <div className={styles.aboutCollections}>
          <AboutContainer
            isAlignedRight
            imageUrl="images/nosotros-about.jpg"
            title="Sobre nosotros"
            text={text1}
          ></AboutContainer>
          <AboutContainer
            isAlignedRight={false}
            imageUrl="images/SantiagoMalet.png"
            title="Por que elegimos este camino?"
            text={text2}
          ></AboutContainer>
          <AboutContainer
            isAlignedRight
            imageUrl="images/nosotros-about.jpg"
            title="somos unos capos"
            text={text3}
          ></AboutContainer>
        </div>
      </div>
    </>
  );
}
export default About;
