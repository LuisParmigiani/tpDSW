import NavbarCarouselHomepage from './components/Navbar-CarouselHomepage/Navbar-CarouselHomepage.js';
import './App.css';
import HomepagePhrase from './components/HomepagePhrase/HomepagePhrase.js';
import HomepageCards from './components/HomepageCards/HomepageCards.js';
import CommentsFooterHomepage from './components/Comments-FooterHomepage/Comments-FooterHomepage.js';
function App() {
  const id_user = undefined; //no se si anda

  return (
    <>
      <NavbarCarouselHomepage id={id_user} />
      <HomepagePhrase />
      <HomepageCards />
      <CommentsFooterHomepage />
    </>
  );
}

export default App;
