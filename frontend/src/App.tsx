import Borrower from './components/Borrower/Borrower.js';
import Homepage from './components/Homepage/Homepage.js';
import './App.css';

import About from './pages/about/about.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Servicios from './pages/about/Servicios.js';
import { Helmet } from 'react-helmet';
import TurnHistory from './components/TurnHistory/TurnHistory.js';

function App() {
  return (
    <>
      <Helmet>
        <title>Nombre de la empresa</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>

      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<About />} />
          <Route path="/borrower/:id" element={<Borrower id={13} />} />
          <Route path="/Servicios" element={<Servicios />} />
          <Route path="/TurnHistory" element={<TurnHistory />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
