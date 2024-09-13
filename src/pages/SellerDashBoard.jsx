import React from 'react';
import { FaUserCircle } from 'react-icons/fa'; 

const SellerProfile = () => {
  return (
    <div className="min-h-screen bg-[#EEEEEE]">
      <nav className="bg-[#393E46] text-white px-8 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">ShelfX</div>
        <div className="space-x-6">
          <a href="#" className="hover:text-[#FFD369]">Home</a>
          <a href="#" className="text-gray-500 cursor-default">My Books</a>
        </div>
        <div className="flex items-center space-x-4">
          <FaUserCircle className="w-8 h-8 text-white" />
          <h3 className='text-xl tracking-wide'>Sailesh</h3>
        </div>
      </nav>

      <div className="p-8 flex flex-wrap gap-4">
        <div className="flex flex-wrap gap-4 w-full lg:w-3/4">
          <div className="bg-[#393E46] text-white flex flex-col items-center justify-center w-52 h-36 rounded-md shadow-md">
            <button className="text-[#FFD369] font-semibold">Upload a book</button>
          </div>
          <div className="bg-[#393E46] text-white flex flex-col items-center justify-center w-52 h-36 rounded-md shadow-md">
            <button className="text-[#FFD369] font-semibold">List a book for rent</button>
          </div>
          <div className="bg-[#393E46] text-white flex flex-col items-center justify-center w-52 h-36 rounded-md shadow-md">
            <button className="text-[#FFD369] font-semibold">Manage rental requests</button>
          </div>
        </div>
        
        <div className="bg-white p-4 shadow-md w-full lg:w-1/4 rounded-md">
          <h3 className="text-[#222831] font-bold mb-2">Learn how to use and rent books with ShelfX</h3>
          <p className="text-[#393E46] text-sm mb-2">Create listings, manage rentals, and connect with readers easily with ShelfX.</p>
          <a href="#" className="text-[#FFD369] font-semibold hover:underline">See tutorials &rarr;</a>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
