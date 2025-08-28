import Borrower from './components/Borrower/Borrower';
import Homepage from './components/Homepage/Homepage';
import Login from './pages/about/App_login';
import Recovery from './pages/about/recovery';
import Registration from './pages/about/registration';
import './App.css';
import TurnHistory from './components/TurnHistory/TurnHistory';
import About from './pages/about/about';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Servicios from './pages/about/Servicios';
import Dashboard from './pages/dashboard/dashboard-p';
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
          <Route path="/historial" element={<TurnHistory />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/turnHistory/success"
            element={<TurnHistory estado="success" />}
          />
          <Route
            path="/turnHistory/failure"
            element={<TurnHistory estado="failure" />}
          />
          <Route
            path="/turnHistory/pending"
            element={<TurnHistory estado="pending" />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
