import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from "../assets/logo.png";

const Navbar = ({ hideAuthButtons }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-[#393E46] border-gray-200 sm:mb-8">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={logo} className="h-8 mb-2" alt="Flowbite Logo" />
          <span className="self-center text-3xl big-shoulders-inline-text-nav whitespace-nowrap text-[#EEEEEE] tracking-widest">
            ShelfX
          </span>
        </a>
        {!hideAuthButtons && (
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button
              type="button"
              className="text-[#222831] font-medium rounded-lg text-sm px-4 py-2 text-center bg-[#FFD369] hover:bg-[#FFD369] focus:bg-[#ecc363] mr-3"
            >
              <Link to="/Login">Login</Link>
            </button>
            <button
              type="button"
              className="text-[#222831] font-medium rounded-lg text-sm px-4 py-2 text-center bg-[#FFD369] hover:bg-[#FFD369] focus:bg-[#ecc363]"
            >
              <Link to="/Register">Sign Up</Link>
            </button>
          </div>
        )}
        <button
          onClick={handleMenuToggle}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-cta"
          aria-expanded={menuOpen ? "true" : "false"}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={`items-center justify-between ${menuOpen ? 'flex' : 'hidden'} w-full md:flex md:w-auto md:order-1`}
          id="navbar-cta"
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 bg-[#393E46] text-center">
            <li>
              <Link
                to="/"
                className="block py-2 px-3 md:p-0 text-[#EEEEEE] hover:text-[#FFD369]"
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-3 md:p-0 text-[#EEEEEE] rounded hover:text-[#FFD369]"
              >
                Features
              </a>
            </li>
            <li>
              <Link
                to="/Contact"
                className="block py-2 px-3 md:p-0 text-[#EEEEEE] rounded hover:text-[#FFD369]"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
