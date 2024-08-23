import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import Contact from './pages/Contact'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Home page route */}
        <Route path="/Contact" element={<Contact />} /> {/* Contact page route */}
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login/>}/>
      </Routes>
    </Router>
  )
}

export default App;
