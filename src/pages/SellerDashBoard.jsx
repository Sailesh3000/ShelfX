import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const SellerProfile = () => {
  const [activeTab, setActiveTab] = useState('myBooks'); 
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // Allow only one image
  const navigate = useNavigate();
  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedImage(null); // Clear image when dialog is closed
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0]; // Only allow the first file
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
    }
  };

  const handleImageRemove = () => {
    setSelectedImage(null); // Remove the selected image
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:5000/logout');
      if (response.status === 200) {
        alert('Logout successful');
        navigate('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  return (
    <div className="min-h-screen bg-[#EEEEEE]">
      {/* Navigation Bar */}
      <nav className="bg-[#393E46] text-white px-8 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">ShelfX</div>
        <div className="space-x-6">
          {/* Tab navigation */}
          <button 
            onClick={() => handleTabClick('home')} 
            className={`hover:text-[#FFD369] ${activeTab === 'home' ? 'text-[#FFD369]' : ''}`}
          >
            Home
          </button>
          <button 
            onClick={() => handleTabClick('myBooks')} 
            className={`hover:text-[#FFD369] ${activeTab === 'myBooks' ? 'text-[#FFD369]' : ''}`}
          >
            My Books
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <FaUserCircle className="w-8 h-8 text-white" />
          <h3 className='text-xl tracking-wide'>Sailesh</h3>
        </div>
        <div className=''>
          <button
            type="button"
            onClick={handleLogout}
            className="text-white font-medium rounded-lg text-sm px-2 py-1 text-center hover:text-[#FFD369] focus:bg-[#ecc363]"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Tab Content */}
      <div className="p-8">
        {activeTab === 'home' ? (
          <div>
            {/* Home tab content */}
            <h2 className="text-2xl font-bold text-[#222831]">Welcome to ShelfX!</h2>
            <p className="text-[#393E46] mt-4">Explore our platform to list, rent, and manage your books efficiently.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {/* My Books tab content */}
            <div className="flex flex-wrap gap-4 w-full lg:w-3/4">
              <div className="bg-[#393E46] text-white flex flex-col items-center justify-center w-52 h-36 rounded-md shadow-md">
                <button 
                  className="text-[#FFD369] font-semibold" 
                  onClick={handleDialogOpen} // Open dialog on click
                >
                  Upload a book
                </button>
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
        )}
      </div>

      {/* Upload Book Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Upload a Book</DialogTitle>
        <DialogContent>
          {/* Drag and Drop Section */}
          <div className="border-dashed border-2 border-gray-400 py-6 text-center rounded-md mb-4">
            <p className="text-gray-500">Drag and Drop file</p>
            <p className="text-gray-500">Or</p>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageSelect} // Single file upload
              className="mt-2"
            />
          </div>

          {/* Display Selected Image Preview */}
          {selectedImage && (
            <div className="relative">
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Selected"
                className="w-24 h-24 object-cover rounded-md"
              />
              <button
                className="absolute top-0 right-0 text-white bg-red-600 rounded-full w-6 h-6"
                onClick={handleImageRemove} // Remove the selected image
              >
                &times;
              </button>
            </div>
          )}

          {/* Other Fields */}
          <TextField
            margin="dense"
            label="Address"
            type="text"
            fullWidth
            variant="filled"
          />
          <TextField
            margin="dense"
            label="Pincode"
            type="text"
            fullWidth
            variant="filled"
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            variant="filled"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">Cancel</Button>
          <Button onClick={handleDialogClose} color="primary">Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SellerProfile;
