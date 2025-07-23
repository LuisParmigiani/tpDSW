import NavbarCarouselHomepage from './components/Navbar-CarouselHomepage/Navbar-CarouselHomepage.js';
import './App.css';
import HomepagePhrase from './components/HomepagePhrase/HomepagePhrase.js';
import HomepageCards from './components/HomepageCards/HomepageCards.js';
import CommentsFooterHomepage from './components/Comments-FooterHomepage/Comments-FooterHomepage.js';
import About from './pages/about/about.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Servicios from './pages/about/Servicios.js';
function App() {
  const id_user = undefined; //no se si anda

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <NavbarCarouselHomepage id={id_user} />
                <HomepagePhrase />
                <HomepageCards />
                <CommentsFooterHomepage />
              </>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/Servicios" element={<Servicios />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
