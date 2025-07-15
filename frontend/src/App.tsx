import NavbarCarouselHomepage from './components/Navbar-CarouselHomepage/Navbar-CarouselHomepage.js';
import './App.css';
import HomepagePhrase from './components/HomepagePhrase/HomepagePhrase.js';
import HomepageCards from './components/HomepageCards/HomepageCards.js';
import Comments from './components/Comments/Comments.js';
import About from './pages/about/about.js'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import CommentsFooterHomepage from './components/Comments-FooterHomepage/Comments-FooterHomepage.js';
function App() {
  const id_user = undefined; //no se si anda

  return (
    
    <>
    <Router>

      <Routes>
        <Route path="/" element={
          <>
            <NavbarCarouselHomepage id={id_user} />
            <HomepagePhrase />
            <HomepageCards />
            <Comments />
          </>  
        } />
        <Route path="/about" element={<About/>}/>
       

        
      </Routes>
    </Router>
      
    <>
      <NavbarCarouselHomepage id={id_user} />
      <HomepagePhrase />
      <HomepageCards />
      <CommentsFooterHomepage />
    </>
  );
}

export default App;
