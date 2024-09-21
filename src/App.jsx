import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SellerAuth from './pages/SellerAuth';
import BuyerAuth from './pages/BuyerAuth';
import BookGrid from './components/BookGrid';
import SellerProfile from './pages/SellerDashBoard';
import Subscription from './pages/Subscription';
import BookGrid from './pages/BookGrid';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login-seller" element={<SellerAuth />} />
        <Route path="/login-Buyer" element={<BuyerAuth />} />
        <Route path="/seller-xyz" element={<SellerProfile />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/bookList" element={<BookGrid />} />
      </Routes>
    </Router>
  );
}

export default App;
