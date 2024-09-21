import React from 'react';

const Modal = ({ closeModal }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-[#393E46] p-8 rounded-lg shadow-lg z-10">
        <h3 className="text-2xl text-[#FFD369] tracking-tight font-extrabold mb-4">Sign Up to View Rentals</h3>
        <p className="mb-6 text-white">Please sign up or log in to access detailed information about this book.</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={closeModal}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <a href='/login-Buyer'>
          <button className="bg-[#FFD369] text-black py-2 px-4 rounded">
            Sign Up
          </button></a>
        </div>
      </div>
    </div>
  );
};

export default Modal;
