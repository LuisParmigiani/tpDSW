import Borrower from './components/Borrower/Borrower.js';
import Homepage from './components/Homepage/Homepage.js';
import './App.css';

import About from './pages/about/about.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Servicios from './pages/about/Servicios.js';
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<About />} />
          <Route path="/borrower/:id" element={<Borrower id={13} />} />
          <Route path="/Servicios" element={<Servicios />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
