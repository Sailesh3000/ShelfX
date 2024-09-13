import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SellerAuth from './pages/SellerAuth';
import Navbar from './components/Navbar';
import SellerProfile from './pages/SellerDashBoard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login-seller" element={<SellerAuth />} />
        <Route path="/seller-xyz" element={<SellerProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
