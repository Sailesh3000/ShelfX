import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress, Snackbar, Alert } from '@mui/material';

const SellerProfile = () => {
  const [activeTab, setActiveTab] = useState('myBooks'); 
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [formData, setFormData] = useState({
    address: '',
    pincode: '',
    price: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const navigate = useNavigate(); 

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedImage(null);
    setFormData({ address: '', pincode: '', price: '' });
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const imageURL = URL.createObjectURL(file);
      setSelectedImage(imageURL);
    }
  };
  
  const handleImageRemove = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }
    setSelectedImage(null);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({ ...prevState, [id]: value }));
  };

  const handleSubmit = async () => {
    const { address, pincode, price } = formData;

    if (!address || !pincode || !price) {
      setSnackbar({ open: true, message: 'Please fill in all fields', severity: 'warning' });
      return;
    }

    const data = new FormData();
    data.append('address', address);
    data.append('pincode', pincode);
    data.append('price', price);

    if (selectedImage) {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      data.append('image', blob, 'image.jpg');
    }

    try {
      const response = await axios.post('http://localhost:5000/uploadBook', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        setSnackbar({ open: true, message: 'Book uploaded successfully', severity: 'success' });
        handleDialogClose();
        setUploadedImages(prev => [...prev, response.data.book]); 
        fetchUserDetails();// Assuming response contains the uploaded book
      } else {
        console.error('Upload failed:', response.data);
        setSnackbar({ open: true, message: 'Upload failed. Please try again.', severity: 'error' });
      }
    } catch (error) {
<<<<<<< HEAD
      if (error.response?.status === 403 && error.response?.data?.redirect) {
        window.location.href = error.response.data.redirect;
      } else {
        console.error("Error uploading book:", error);
        alert('Error uploading the book. Please check your subscription or try again.');
      }
=======
      console.error('Failed to upload book:', error);
      setSnackbar({ open: true, message: 'Failed to upload book. Please try again.', severity: 'error' });
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get('http://localhost:5000/details', {
        withCredentials: true,
      });
      setUser(response.data.user); // Assuming user now has username
      setUploadedImages(response.data.books);
    } catch (error) {
      console.error("Error fetching current user:", error);
      setUser(null);
      setUploadedImages([]);
      setSnackbar({ open: true, message: 'Failed to fetch user details', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();

    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, []);

  const handleDelete = async (bookId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/deleteBook/${bookId}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setUploadedImages(prev => prev.filter(book => book.id !== bookId));
        setSnackbar({ open: true, message: 'Book removed successfully', severity: 'success' });
        fetchUserDetails(); // Refresh the uploaded books
      }
    } catch (error) {
      console.error("Error removing book:", error);
      setSnackbar({ open: true, message: 'Failed to remove book. Please try again.', severity: 'error' });
>>>>>>> c337f682088f5d216926ccef5e24eded1635594b
    }
  };
  
  
  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:5000/logout', {}, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setSnackbar({ open: true, message: 'Logout successful', severity: 'success' });
        navigate('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      setSnackbar({ open: true, message: 'Failed to logout. Please try again.', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#EEEEEE]">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EEEEEE]">
      {/* Navigation Bar */}
      <nav className="bg-[#393E46] text-white px-8 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">ShelfX</div>
        <div className="flex items-center space-x-4">
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
          {user ? <h3 className='text-xl tracking-wide'>{user.username}</h3> : <h3 className='text-xl tracking-wide'>Guest</h3>}
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
            <h2 className="text-2xl font-bold text-[#222831]">Welcome to ShelfX!</h2>
            <p className="text-[#393E46] mt-4">Explore our platform to list, rent, and manage your books efficiently.</p>
          </div>
        ) : activeTab === 'myBooks' ? (
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-wrap gap-4 w-full lg:w-3/4">
              <div className="bg-[#393E46] text-white flex flex-col items-center justify-center w-52 h-36 rounded-md shadow-md">
                <button 
                  className="text-[#FFD369] font-semibold" 
                  onClick={handleDialogOpen}
                >
                  Upload a book
                </button>
              </div>
              <div className="bg-[#393E46] text-white flex flex-col items-center justify-center w-52 h-36 rounded-md shadow-md">
                <button className="text-[#FFD369] font-semibold">Manage rental requests</button>
              </div> 
              <div className="bg-[#393E46] text-white flex flex-col items-center justify-center w-52 h-36 rounded-md shadow-md">
              <button 
            onClick={() => handleTabClick('showBoooks')} 
            
            className={`hover:text-[#FFD369] ${activeTab === 'showBoooks' ? 'text-[#FFD369]' : ''}`}
          >
            Show Books
          </button></div>
            </div>
          </div>
        ) : activeTab === 'showBoooks' && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 text-[#222831]">Uploaded Books</h3>
            <div className="flex flex-wrap gap-4 w-full p-4">
              {uploadedImages.length > 0 ? (
                uploadedImages.map((book) => (
                  <div key={book.id} className="bg-white p-4 border rounded-md shadow-md flex flex-col justify-between min-h-[350px] w-[250px]">
                    <img src={book.imageUrl} alt={`Uploaded ${book.address}`} className="max-w-full max-h-[300px] object-cover rounded-md mb-2" />
                    <div className="mt-2">
                      <p className="text-[#393E46]"><strong>Address:</strong> {book.address}</p>
                      <p className="text-[#393E46]"><strong>Pincode:</strong> {book.pincode}</p>
                      <p className="text-[#393E46]"><strong>Price:</strong> ${book.price}</p>
                    </div>
                    <button onClick={() => handleDelete(book.id)} className="mt-4 text-white bg-red-500 rounded-md px-4 py-2 hover:bg-red-600">
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No books uploaded yet.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      {/* Upload Dialog */}
<Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
  <DialogTitle sx={{ backgroundColor: '#393E46', color: '#FFFFFF', fontWeight: 'bold' }}>
    Upload a Book
  </DialogTitle>
  <DialogContent sx={{ backgroundColor: '#EEEEEE', paddingTop: '16px' }}>
    <input
      type="file"
      onChange={handleImageSelect}
      accept="image/*"
      className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
    />
    {selectedImage && (
      <div className="mt-4">
        <img
          src={selectedImage}
          alt="Selected"
          className="w-full h-auto rounded-md shadow-md"
        />
        <button
          onClick={handleImageRemove}
          className="mt-2 text-red-500 hover:underline"
        >
          Remove Image
        </button>
      </div>
    )}
    <TextField
      id="address"
      label="Address"
      variant="outlined"
      value={formData.address}
      onChange={handleInputChange}
      fullWidth
      className="mt-4"
      sx={{
        backgroundColor: '#FFFFFF',
        borderRadius: '4px',
      }}
    />
    <TextField
      id="pincode"
      label="Pincode"
      variant="outlined"
      value={formData.pincode}
      onChange={handleInputChange}
      fullWidth
      className="mt-4"
      sx={{
        backgroundColor: '#FFFFFF',
        borderRadius: '4px',
      }}
    />
    <TextField
      id="price"
      label="Price"
      variant="outlined"
      value={formData.price}
      onChange={handleInputChange}
      fullWidth
      className="mt-4"
      sx={{
        backgroundColor: '#FFFFFF',
        borderRadius: '4px',
      }}
    />
  </DialogContent>
  <DialogActions sx={{ backgroundColor: '[#FFD369]', padding: '16px' }}>
    <Button onClick={handleDialogClose} color="secondary" variant="contained">
      Cancel
    </Button>
    <Button onClick={handleSubmit}  color="primary" variant="contained">
      Upload
    </Button>
  </DialogActions>
</Dialog>


      {/* Snackbar for Notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SellerProfile;
