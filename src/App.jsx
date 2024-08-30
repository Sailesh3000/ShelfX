import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import LoginSeller from './pages/LoginSeller';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login-seller" element={<LoginSeller />} />
      </Routes>
    </Router>
  );
}

export default App;
