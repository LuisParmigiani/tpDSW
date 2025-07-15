import NavbarCarouselHomepage from './components/Navbar-CarouselHomepage/Navbar-CarouselHomepage.js';
import './App.css';
import HomepagePhrase from './components/HomepagePhrase/HomepagePhrase.js';
import HomepageCards from './components/HomepageCards/HomepageCards.js';
import CommentsHomepage from './components/CommentsHomepage/CommentsHomepage.js';
function App() {
  const id_user = undefined; //no se si anda

  return (
    <>
      <NavbarCarouselHomepage id={id_user} />
      <HomepagePhrase />
      <HomepageCards />
      <CommentsHomepage />
    </>
  );
}

export default App;
