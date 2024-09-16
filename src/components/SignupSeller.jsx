import React, { useState } from 'react';

const SignupSeller = ({ onToggle }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [isLogin, setIsLogin] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password confirmation check
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/login-seller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.text();
      if (data === 'Registration successful') {
        setIsLogin(true);
        alert('Account created successfully!');
      } else {
        alert('Registration failed');
      }
    } catch (error) {
      console.log('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="justify-center px-4 lg:py-0 w-[500px] sm:px-8 sm:gap-2">
      <div className="w-full bg-[#393E46] rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-2xl text-[#FFD369] tracking-tight font-extrabold mb-4">
            Create a Seller account
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block mb-2 text-sm font-medium text-[#FFD369]">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#FFD369] focus:border-[#FFD369] block w-full p-2.5"
                placeholder="Enter your username"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-[#FFD369]">Your email</label>
              <input 
                type="email" 
                name="email" 
                id="email" 
                value={formData.email}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#FFD369] focus:border-[#FFD369] block w-full p-2.5" 
                placeholder="name@company.com" 
                required 
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-[#FFD369]">Password</label>
              <input 
                type="password" 
                name="password" 
                id="password" 
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••" 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#FFD369] focus:border-[#FFD369] block w-full p-2.5" 
                required 
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-[#FFD369]">Confirm password</label>
              <input 
                type="password" 
                name="confirmPassword" 
                id="confirm-password" 
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••" 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#FFD369] focus:border-[#FFD369] block w-full p-2.5" 
                required 
              />
            </div>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input 
                  id="terms" 
                  aria-describedby="terms" 
                  type="checkbox" 
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-[#FFD369]" 
                  required 
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-light text-white">
                  I accept the <a className="font-medium text-[#FFD369] hover:underline" href="#">Terms and Conditions</a>
                </label>
              </div>
            </div>
            <button 
              type="submit" 
              className="w-full text-gray-900 bg-[#FFD369] hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-[#FFD369] font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              Create an account
            </button>
            <p className="text-sm font-light text-white">
              Already have an account? <a href="#" onClick={onToggle} className="font-medium text-[#FFD369] hover:underline">Login here</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupSeller;