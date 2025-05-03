import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress, Snackbar, Alert } from '@mui/material';
import RequestList from '../components/RequestList';
import bcrypt from 'bcryptjs';

const SellerProfile = () => {
  const [activeTab, setActiveTab] = useState('myBooks'); 
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [openpassDialog, setOpenpassDialog] = useState(false);
  const [opennameDialog, setOpennameDialog] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [formData, setFormData] = useState({
    bookName: '',
    address: '',
    pincode: '',
    price: '',
    listingType: 'sell' // Default to sell
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [formData1, setFormData1] = useState({
    username: '',
    password: '',
  });
  const [formData2, setFormData2] = useState({
    password: '',
    newpassword:'',
    confirmPassword: '',
  });

  const navigate = useNavigate(); 

  // Check authentication on component mount
  useEffect(() => {
    checkAuthentication();
  });

  // Function to check if user is authenticated
  const checkAuthentication = async () => {
    try {
      const response = await axios.get('http://localhost:5000/check-auth', {
        withCredentials: true,
      });
      
      if (response.data.authenticated) {
        setAuthenticated(true);
        fetchUserDetails();
      } else {
        // Redirect to login page if not authenticated
        navigate('/login-seller', { state: { from: '/seller-profile' } });
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
      // Redirect to login page on error
      navigate('/login-seller', { state: { from: '/seller-profile' } });
    }
  };

  const handleChange2 = (e) => {
    const { name, value } = e.target;
    setFormData2({
      ...formData2,
      [name]: value,
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setOpenpassDialog(false);
    setOpennameDialog(false);
    setSelectedImage(null);
    setFormData({ bookName: '', address: '', pincode: '', price: '' });
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleImageSelect = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]); // Store the actual File object
      
      // If you need a preview, you can separately create a blob URL
      const previewUrl = URL.createObjectURL(event.target.files[0]);
      setImagePreview(previewUrl);
  }
  };
  
  const handleImageRemove = () => {
    if (selectedImage) {
      URL.revokeObjectURL(imagePreview);
    }
    setSelectedImage(null);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({ ...prevState, [id]: value }));
  };

  const handleSubmit = async () => {
    const { bookName, address, pincode, price } = formData;

    if (!bookName || !address || !pincode || !price || !selectedImage) {
        setSnackbar({ open: true, message: 'Please fill in all fields including an image', severity: 'warning' });
        return;
    }

    console.log("Selected Image:", selectedImage); // Debugging log

    // Ensure selectedImage is a valid File
    if (!(selectedImage instanceof File)) {
        setSnackbar({ open: true, message: 'Invalid file selection', severity: 'error' });
        return;
    }

    try {
        // Convert image to base64
        const base64Image = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(selectedImage);
        });

        console.log("Base64 Image:", base64Image.slice(0, 50)); // Debugging log (first 50 chars)

        const uploadResponse = await axios.post('http://localhost:5000/uploadBook', {
            bookName,
            address,
            pincode,
            price,
            listingType: formData.listingType,
            image: base64Image, // Send base64 image
        }, {
            withCredentials: true,
        });

        if (uploadResponse.status === 201) {
            setSnackbar({ open: true, message: 'Book uploaded successfully', severity: 'success' });
            handleDialogClose();
            setUploadedImages(prev => [...prev, uploadResponse.data.book]);
            fetchUserDetails();
        }
    } catch (error) {
        console.error('Failed to upload book:', error);
        if (error.response?.status === 403) {
            navigate('/subscription');
            return;
        }
        setSnackbar({
            open: true,
            message: error.response?.data?.message || 'Failed to upload book',
            severity: 'error'
        });
    }
};


  const fetchUserDetails = async () => {
    try {
      const response = await axios.get('http://localhost:5000/details', {
        withCredentials: true,
      });
      setUser(response.data.user);
      console.log(response.data.user);
      setUploadedImages(response.data.books);
      console.log(response.data.books);
      if (response.data.books) {
        response.data.books.forEach(book => {
          console.log('Fetched listingType:', book.listingType);
        });
      }
      
      // After setting user, fetch subscription
      if (response.data.user && response.data.user.id) {
        fetchSubscription(response.data.user.id);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      setUser(null);
      setUploadedImages([]);
      setSnackbar({ open: true, message: 'Failed to fetch user details', severity: 'error' });
      
      // If 401 Unauthorized, redirect to login
      if (error.response && error.response.status === 401) {
        navigate('/login', { state: { from: '/seller-profile' } });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscription = async (userId) => {
    if (!userId) return;
    
    try {
      const response = await axios.get(`http://localhost:5000/subscription/${userId}`, {
        withCredentials: true,
      });
      setSubscription(response.data);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  });

  const handleDelete = async (bookId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/deleteBook/${bookId}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setUploadedImages(prev => prev.filter(book => book.id !== bookId));
        setSnackbar({ open: true, message: 'Book removed successfully', severity: 'success' });
        fetchUserDetails();
      }
    } catch (error) {
      console.error("Error removing book:", error);
      setSnackbar({ open: true, message: 'Failed to remove book. Please try again.', severity: 'error' });
    }
  };

  const handleChange1 = (e) => {
    const { name, value } = e.target;
    console.log(`Changed: ${name} = ${value}`);
    setFormData1({
      ...formData1,
      [name]: value,
    });
  };
  
  const handleSubmitname = async (e) => {
    e.preventDefault();
    
    console.log('Form Password:', formData1.password);
    console.log('User Password:', user.password);
  
    // Ensure that user.password and formData1.password are properly defined.
    const passwordMatch = await bcrypt.compare(formData1.password, user.password);
    
    if (!passwordMatch) {
      alert('Passwords do not match!');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/Edituserprofile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData1.username,
        }),
        credentials: 'include',  // Include cookies
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
  
      if (data.message === 'Username updated successfully') {
        alert('Username updated successfully!');
        fetchUserDetails();  // Refresh user details
        handleDialogClose();
      } else {
        alert('Update failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };
  
  const handleSubmitpassword = async (e) => {
    e.preventDefault();
    
    const passwordMatch = await bcrypt.compare(formData2.password, user.password);
    if (!passwordMatch || formData2.newpassword !== formData2.confirmPassword) {
      alert('Current password is incorrect or new passwords do not match!');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/Edituserprofile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newpassword: formData2.newpassword,
        }),
        credentials: 'include',  // Include cookies
      });
  
      const data = await response.json();
      if (data.message === 'password updated successfully') {
        alert('Password updated successfully!');
        handleDialogClose();
      } else {
        alert('Update failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
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
            className="text-white font-medium rounded-lg text-sm px-2 py-1 text-center hover:text-[#FFD369]"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Tab Content */}
      <div className="p-8 ">
        {activeTab === 'home' ? (
          <div>
            <h2 className="text-2xl font-bold text-[#222831]">Welcome to ShelfX!</h2>
            <div className='flex flex-between '>
            <div className="bg-[#393E46] text-white flex flex-col items-center mt-4 justify-center w-52 h-36 rounded-md shadow-md mr-[20px]">
              <button 
                className="text-[#FFD369] font-semibold" 
                onClick={() => setOpenpassDialog(true)}
              >
                Change your password 
              </button>
            </div>
            <div className="bg-[#393E46] text-white flex flex-col items-center mt-4 justify-center w-52 h-36 rounded-md shadow-md">
              <button 
                className="text-[#FFD369] font-semibold" 
                onClick={() => setOpennameDialog(true)}
              >
                Change your name
              </button>
            </div></div>
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
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-[#393E46]"><strong>Book Name:</strong> {book.bookName}</p>
                        <span className={`px-2 py-1 rounded text-white text-sm ${book.listingType?.trim().toLowerCase() === "rent" ? 'bg-blue-500' : 'bg-green-500'}`}>
  {book.listingType?.trim().toLowerCase() === "rent" ? 'RENT' : 'SELL'}
</span>
                        </div>
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
                src={imagePreview}
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
                id="bookName"
                label="Book Name"
                variant="filled"
                value={formData.bookName}
                onChange={handleInputChange}
                fullWidth
                className="mt-4"
                sx={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '4px',
                }}
          />
          <TextField
            id="address"
            label="Address"
            variant="filled"
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
            variant="filled"
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
            variant="filled"
            value={formData.price}
            onChange={handleInputChange}
            fullWidth
            className="mt-4"
            sx={{
              backgroundColor: '#FFFFFF',
              borderRadius: '4px',
            }}
          />
          <div className="mt-4">
            <select
              id="listingType"
              value={formData.listingType}
              onChange={handleInputChange}
              className="w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="sell">Sell</option>
              <option value="rent">Rent</option>
            </select>
          </div>
          {subscription && (
                <div>
                  <h3>Subscription Details</h3>
                  <p>Plan: {subscription.plan}</p>
                </div>
              )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#EEEEEE', padding: '16px' }}>
          <Button onClick={handleDialogClose} color="secondary" variant="contained">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Name Dialog */}
      <Dialog open={opennameDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#393E46', color: '#FFFFFF', fontWeight: 'bold' }}>
          Change Your Name
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#EEEEEE', paddingTop: '16px' }}>
          <TextField
            name="password"
            label="Current Password"
            variant="outlined"
            type="password"
            value={formData1.password}
            onChange={handleChange1}
            fullWidth
            className="mt-4"
            sx={{ backgroundColor: '#FFFFFF', borderRadius: '4px' }}
          />
          <TextField
            name="username"
            label="Username"
            variant="outlined"
            value={formData1.username}
            onChange={handleChange1}
            fullWidth
            className="mt-4"
            sx={{ backgroundColor: '#FFFFFF', borderRadius: '4px' }}
          />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#FFD369', padding: '16px' }}>
          <Button onClick={handleDialogClose} color="secondary" variant="outlined">Cancel</Button>
          <Button onClick={handleSubmitname} color="primary" variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={openpassDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#393E46', color: '#FFFFFF', fontWeight: 'bold' }}>
          Change Your Password
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#EEEEEE', paddingTop: '16px' }}>
          <TextField
            name="password"
            label="Current Password"
            variant="outlined"
            type="password"
            value={formData2.password}
            onChange={handleChange2}
            fullWidth
            className="mt-4"
            sx={{ backgroundColor: '#FFFFFF', borderRadius: '4px' }}
          />
          <TextField
            name="newpassword"
            label="New Password"
            variant="outlined"
            type="password"
            value={formData2.newpassword}
            onChange={handleChange2}
            fullWidth
            className="mt-4"
            sx={{ backgroundColor: '#FFFFFF', borderRadius: '4px' }}
          />
          <TextField
            name="confirmPassword"
            label="Confirm Password"
            variant="outlined"
            type="password"
            value={formData2.confirmPassword}
            onChange={handleChange2}
            fullWidth
            className="mt-4"
            sx={{ backgroundColor: '#FFFFFF', borderRadius: '4px' }}
          />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#FFD369', padding: '16px' }}>
          <Button onClick={handleDialogClose} color="secondary" variant="outlined">Cancel</Button>
          <Button onClick={handleSubmitpassword} color="primary" variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      {user && <RequestList sellerId={user.id} />}
    </div>
  );
};

export default SellerProfile;