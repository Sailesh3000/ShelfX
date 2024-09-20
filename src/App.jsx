import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SellerAuth from './pages/SellerAuth';
import Navbar from './components/Navbar';
import SellerProfile from './pages/SellerDashBoard';
import Subscription from './pages/Subscription';
import BookGrid from './pages/BookGrid';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login-seller" element={<SellerAuth />} />
        <Route path="/seller-xyz" element={<SellerProfile />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/bookList" element={<BookGrid />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
