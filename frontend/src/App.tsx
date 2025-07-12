import NavBarCarouselHomepage from './components/navBar-carousel.homepage';
import './App.css';
import HomepagePhrase from './components/homepage.phrase';
import HomepageCards from './components/homepage.cards';
function App() {
  const id_user = undefined; //no se si anda

  return (
    <>
      <NavBarCarouselHomepage id={id_user} />
      <HomepagePhrase />
      <HomepageCards />
    </>
  );
}

export default App;
