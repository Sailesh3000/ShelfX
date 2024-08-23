import React, { useState } from 'react';
import Navbar from './Navbar';
import '../App.css';
import { Navigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [isRegistered, setIsRegistered] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Send a POST request to the Node.js backend
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.text();
      if (data === "Registration successful") {
        setIsRegistered(true); // Set state to trigger redirect
        alert(data);
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("An error occurred. Please try again.");
    }
  };

  if (isRegistered) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-grey-200">
      <Navbar hideAuthButtons={true} />
      <div className="container mx-auto p-6 md:p-12 bg-grey-200">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#FFD369] subpixel-antialiased">Create an Account</h2>
        <div className="max-w-lg mx-auto p-8 rounded-lg shadow-[#FFD369] shadow-xl bg-grey-500">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[#FFD369]">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3"
                placeholder="Enter your username"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#FFD369]">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#FFD369]">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3"
                placeholder="Enter your password"
                required
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-[#FFD369]">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3"
                placeholder="Confirm your password"
                required
              />
            </div><br />
            <button
              type="submit"
              className="w-full bg-[#FFD369] text-xl text-gray-700 py-2 rounded-lg hover:bg-[#BBB111] focus:outline-none focus:ring-2 focus:ring-[#FFD369]"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
