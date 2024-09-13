import React from 'react';

const LoginSeller = ({ onToggle }) => {
  return (
    <div className="justify-center px-4 lg:py-0 w-[500px] sm:px-8 sm:gap-2">
      <div className="w-full bg-[#393E46] rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-2xl text-[#FFD369] tracking-tight font-extrabold mb-4">
            Login to your account
          </h1>
          <form className="space-y-4 md:space-y-6" action="#">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Your email</label>
              <input 
                type="email" 
                name="email" 
                id="email" 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#FFD369] focus:border-[#FFD369] block w-full p-2.5" 
                placeholder="name@company.com" 
                required 
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Password</label>
              <input 
                type="password" 
                name="password" 
                id="password" 
                placeholder="••••••••" 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#FFD369] focus:border-[#FFD369] block w-full p-2.5" 
                required 
              />
            </div>
            <button 
              type="submit" 
              className="w-full text-gray-900 bg-[#FFD369] hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-[#FFD369] font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              Login
            </button>
            <p className="text-sm font-light text-white">
              Don't have an account? <a href="#" onClick={onToggle} className="font-medium text-[#FFD369] hover:underline">Sign up here</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginSeller;