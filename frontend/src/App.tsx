import Borrower from './components/Borrower/Borrower.js';
import Homepage from './components/Homepage/Homepage.js';
import Login from './pages/about/App_login.js';
import Recovery from './pages/about/recovery.js';
import Registration from './pages/about/registration.js';
import './App.css';
import TurnHistory from './components/TurnHistory/TurnHistory.js';
import About from './pages/about/about.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Servicios from './pages/about/Servicios.js';
function App() {
  // Creación de la API DSP hay que llevarla a login

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<About />} />
          <Route path="/borrower/:id" element={<Borrower />} />
          <Route path="/Servicios" element={<Servicios />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recovery" element={<Recovery />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/TurnHistory" element={<TurnHistory />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
