import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const SellerProfile = () => {
  const [activeTab, setActiveTab] = useState('myBooks'); 
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // Base64 image data
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
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(URL.createObjectURL(file)); // Convert File to URL
    }
  };
  
  const handleImageRemove = () => {
    setSelectedImage(null); // Remove the URL and File
  };
  

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('address', document.getElementById('address').value);
    formData.append('pincode', document.getElementById('pincode').value);
    formData.append('price', document.getElementById('price').value);
  
    if (selectedImage) {
      const file = await fetch(selectedImage).then(res => res.blob());
      formData.append('image', file, 'image.jpg');
    }
  
    try {
      const response = await axios.post('http://localhost:5000/uploadBook', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, // Include credentials
      });
  
      if (response.status === 200) {
        alert('Book uploaded successfully');
        handleDialogClose();
      } else {
        console.error('Upload failed:', response.data);
      }
    } catch (error) {
      if (error.response?.status === 403 && error.response?.data?.redirect) {
        window.location.href = error.response.data.redirect;
      } else {
        console.error("Error uploading book:", error);
        alert('Error uploading the book. Please check your subscription or try again.');
      }
    }
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
          <div className="border-dashed border-2 border-gray-300 p-4 rounded-md text-center">
            <p className="text-gray-600">Drag and drop an image here or click to select a file</p>
            <input type="file" accept="image/*" onChange={handleImageSelect} />
          </div>
          
          {selectedImage && (
            <div className="mt-4 text-center">
              <img src={selectedImage} alt="Selected" className="max-w-xs max-h-60 object-cover mx-auto" />
              <button 
                onClick={handleImageRemove} 
                className="mt-2 text-red-600 hover:underline"
              >
                Remove Image
              </button>
            </div>
          )}
          
          <TextField
            margin="dense"
            id="address"
            label="Address"
            type="text"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            id="pincode"
            label="Pincode"
            type="text"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            id="price"
            label="Price"
            type="text"
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SellerProfile;
