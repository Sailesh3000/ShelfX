import React, { useEffect, useState } from "react";
import { FaUserCircle, FaHeart, FaTimes } from "react-icons/fa"; // Added FaTimes import
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import bcrypt from 'bcryptjs';


const BookGrid = () => {
  const [activeTab, setActiveTab] = useState("myBooks");
  const [user, setUser] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  
  const [openpassDialog, setOpenpassDialog] = useState(false);
  const [opennameDialog, setOpennameDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [seller, setSeller] = useState(null);
  const [currentBookId, setCurrentBookId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userPincode, setUserPincode] = useState("");
  const [isSortedByPincode, setIsSortedByPincode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookToBuy, setBookToBuy] = useState(null);
  const [isBuyDialogOpen, setIsBuyDialogOpen] = useState(false);
  const [req, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData1, setFormData1] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [formData2, setFormData2] = useState({
    password: '',
    newPassword: '',
    confirmPassword: '',
  });


  const handleChange2 = (e) => {
    const { name, value } = e.target;
    setFormData2({
      ...formData2,
      [name]: value,
    });
  };
    const fetchStatusRequests = async () => {
      try {
        const response = await axios.get("http://localhost:5000/status");
        console.log(response);
        setRequests(response.data.requests);
      } catch (err) {
        setError(err.response?.data?.message || err.message); 
      } finally {
        setLoading(false);
      }
    };


  const navigate = useNavigate();
  const Card = ({ name, time, amount, date, status }) => {
    let statusColor;
    let bgColor;
    switch (status) {
      case "APPROVED":
        statusColor = "bg-green-100 text-green-700";
        bgColor = "bg-green-100";
        break;
      case "REJECTED":
        statusColor = "bg-red-100 text-red-700";
        bgColor = "bg-red-100";
        break;
      default:
        statusColor = "bg-white-100 text-pink-700";
        bgColor = "bg-white-100";
    }
  
    return (
      <div className={`p-4 ${bgColor} shadow-md rounded-lg max-w-80`}>
        <h3 className="text-lg font-semibold p-2">{name}</h3>
        <div className="text-sm text-gray-600 p-2">
          <span className="ml-auto">Price:- {amount}</span>
        </div>
        <p className="text-sm text-gray-500 p-2">Date:- {date}</p>
        <div className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
          {status}
        </div>
      </div>
    );
  };
  

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get("http://localhost:5000/explore", {
        withCredentials: true,
      });
      setUser(response.data.user);
      setUploadedImages(response.data.books);
      setUserPincode(response.data.user.pincode); // Assuming user's pincode is part of the response
    } catch (error) {
      console.error("Error fetching current user:", error);
      setUser(null);
      setUploadedImages([]);
      setSnackbar({
        open: true,
        message: "Failed to fetch user details",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchStatusRequests();
  }, []);

  const getUserDetails = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/sellerdetails/${userId}`,
        {
          withCredentials: true,
        }
      );
      setSeller(response.data.user);
      console.log("Seller Details set in Redux:", response.data.user);

    } catch (error) {
      console.error("Error fetching seller details:", error);
      setSeller(null);
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

    const passwordMatch = await bcrypt.compare(formData1.password, user.password);
    if (!passwordMatch) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/Editbuyerprofile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData1.username,
        }),
      });

      const data = await response.json();
      if (data.message === 'Username updated successfully') {
        alert('Username updated successfully!');
      } else {
        alert('Update failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleSubmitpassword = async (e) => {
    e.preventDefault();
    console.log('Form Password:', formData2.password);
    console.log('User Password:', user.password);

    const passwordMatch = await bcrypt.compare(formData2.password, user.password);
    if (!passwordMatch || formData2.newPassword !== formData2.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/Editbuyerprofile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newPassword: formData2.newPassword,
        }),
      });

      const data = await response.json();
      if (data.message === 'Password updated successfully') {
        alert('Password updated successfully!');
      } else {
        alert('Update failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleDialogClose = () => {
   
    setOpenpassDialog(false);
    setOpennameDialog(false);
  };
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/logout",
        {},
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: "Logout successful",
          severity: "success",
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      setSnackbar({
        open: true,
        message: "Failed to logout. Please try again.",
        severity: "error",
      });
    }
  };

  const toggleFavorite = (bookId) => {
    setFavorites((prevFavorites) => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(bookId)) {
        newFavorites.delete(bookId);
      } else {
        newFavorites.add(bookId);
      }
      return newFavorites;
    });
  };

  const handleSeeDetails = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
    setCurrentBookId(book.id);
    getUserDetails(book.userId);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
    document.body.style.overflow = "auto";
  };

  const handleBuyRequest = (book) => {
    setBookToBuy(book);
    setIsBuyDialogOpen(true);
  };

  const confirmBuyRequest = async () => {
    try {
      const requestData = {
        userId: selectedBook.userId, // Seller's user ID
        buyerId: user.id,             // Buyer's user ID
        bookId: bookToBuy.id ,         // Book ID
        sellerId : seller.userId
      };

      const response = await axios.post("http://localhost:5000/request", requestData, {
        withCredentials: true,
      });

      setSnackbar({
        open: true,
        message: response.data.message || "Book request successful!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error requesting book:", error);
      setSnackbar({
        open: true,
        message: "Failed to request the book.",
        severity: "error",
      });
    } finally {
      setIsBuyDialogOpen(false);
      setBookToBuy(null); // Reset the book to buy
    }
  };

  const handleSortByPincode = () => {
    setIsSortedByPincode(!isSortedByPincode); // Toggle the sorting state
  };

  // Filter books based on the search query
  const filteredBooks = uploadedImages.filter((book) =>
    book.bookName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort books based on pincode if the sort button is toggled
  const sortedBooks = isSortedByPincode
    ? filteredBooks.sort((a, b) => {
        const pincodeA = parseInt(a.pincode, 10);
        const pincodeB = parseInt(b.pincode, 10);
        return (
          Math.abs(pincodeA - userPincode) - Math.abs(pincodeB - userPincode)
        );
      })
    : filteredBooks;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation Bar */}
      <nav className="bg-[#393E46] text-white px-8 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">ShelfX</div>
        <div className="flex items-center justify-center gap-4 text-xl">
          <button
            className={`hover:text-[#FFD369] ${
              activeTab === "myBooks" ? "text-[#FFD369]" : ""
            } ml-36`}
            onClick={() => setActiveTab("myBooks")}
          >
            Books
          </button>
          <button
            className={`hover:text-[#FFD369] ${
              activeTab === "favourites" ? "text-[#FFD369]" : ""
            }`}
            onClick={() => setActiveTab("favourites")}
          >
            Requested
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <FaUserCircle className="w-8 h-8 text-white" />
          <h3 className="text-xl tracking-wide">
            {user ? user.username : "Guest"}
          </h3>
          {user && (
            <button
              type="button"
              onClick={handleLogout}
              className="text-white font-medium rounded-lg text-xl px-2 py-1 text-center hover:text-[#FFD369]"
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* Content Based on Active Tab */}
      <div className="p-6">
        {activeTab === "myBooks" ? (
          <>
            {/* Search Input and Sort Button */}
            <div className="text-center mb-6">
              <input
                type="text"
                placeholder="Search by book name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 w-1/3 rounded-md text-[#222831]"
              />
              <button
                onClick={handleSortByPincode}
                className="ml-4 px-4 py-2 bg-[#FFD369] text-black rounded-md hover:bg-[#e0c258]"
              >
                {isSortedByPincode ? "Clear Sorting" : "Sort by Nearest"}
              </button>
            </div>

            <div className="flex flex-wrap gap-4 w-full p-4">
              {sortedBooks.length > 0 ? (
                sortedBooks.map((book) => (
                  <div
                    key={book.id}
                    className="bg-[#222831] p-4 border rounded-md shadow-md flex flex-col justify-between min-h-[350px] w-[250px]"
                  >
                    <img
                      src={book.imageUrl}
                      alt={`Uploaded ${book.address}`}
                      className="max-w-full max-h-[300px] object-cover rounded-md mb-2"
                    />
                    <div className="mt-2">
                      <p className="text-[#EEEEEE]">
                        <strong>Book Name:</strong> {book.bookName}
                      </p>
                      <p className="text-[#EEEEEE]">
                        <strong>Price:</strong> Rs {book.price}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <button
                          onClick={() => toggleFavorite(book.id)}
                          className="text-red-500"
                        >
                          <FaHeart
                            className={`${
                              favorites.has(book.id)
                                ? "text-red-600"
                                : "text-gray-400"
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => handleSeeDetails(book)}
                          className="bg-[#FFD369] text-black px-3 py-1 rounded-md hover:bg-[#e0c258]"
                        >
                          See Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No books uploaded yet.</p>
              )}
            </div>
          </>
        ) : (
            <div className="p-8">
              <h1 className="text-2xl font-bold mb-6">History</h1>
              <div className='flex'>
          <div className="bg-[#393E46] text-white flex flex-col items-center justify-center w-52 h-36 rounded-md shadow-md mr-[20px]">
              <button 
                className="text-[#FFD369] font-semibold" 
                onClick={() => setOpenpassDialog(true)}
              >
                Change your password 
              </button>
            </div>
            <div className="bg-[#393E46] text-white flex flex-col items-center justify-center w-52 h-36 rounded-md shadow-md">
              <button 
                className="text-[#FFD369] font-semibold" 
                onClick={() => setOpennameDialog(true)}
              >
                Change your name
              </button>
            </div> </div>
            <br />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
                {req.length > 0 ? (
                  req.map((request) => (
                    <Card
                      key={request.bookId} 
                      name={request.bookName}
                      amount={request.bookPrice}
                      date={new Date(request.date).toLocaleDateString()} // Format the date
                      status={request.status}
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-500">No requests found</p>
                )}
              </div>
            </div>
        )
      }
      </div>
      <Dialog open={isBuyDialogOpen} onClose={() => setIsBuyDialogOpen(false)}>
        <DialogTitle>Confirm Buy Request</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to request to buy "{bookToBuy?.bookName}"?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsBuyDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmBuyRequest} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

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
   <Button onClick={ handleSubmitname} color="primary" variant="contained">Submit</Button>
 </DialogActions>
</Dialog>

{/* /////////////////////////////////// chnaging password ////////////////  */}
<Dialog open={openpassDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
 <DialogTitle sx={{ backgroundColor: '#393E46', color: '#FFFFFF', fontWeight: 'bold' }}>
   Change Your Name
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
     label="newpassword"
     variant="outlined"
       type="newpassword"
     value={formData2.newpassword}
     onChange={handleChange2}
     fullWidth
     className="mt-4"
     sx={{ backgroundColor: '#FFFFFF', borderRadius: '4px' }}
   />
    <TextField
     name="confirmpassword"
     label="confirmpassword"
     variant="outlined"
       type="confirmpassword"
     value={formData2.confirmpassword}
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      {isModalOpen && selectedBook && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                onClick={closeModal}
              >
                <div
                  className="bg-[#222831] rounded-lg p-6 w-1/3 max-w-xl h-auto max-h-[90%] overflow-y-auto relative md:w-2/3 sm:w-full"
                  onClick={(e) => e.stopPropagation()}
                  role="dialog"
                  aria-modal="true"
                >
                  {/* Close Button */}
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none"
                  >
                    <FaTimes className="w-6 h-6" />
                  </button>

                  {/* Content Section */}
                  <div className="flex flex-col items-center text-white">
                    {/* Book Image */}
                    <img
                      src={selectedBook.imageUrl}
                      alt={selectedBook.bookName}
                      className="w-full max-w-[250px] object-cover rounded-lg shadow-md mb-4"
                    />

                    {/* Book Info */}
                    <h2 className="text-2xl font-bold mb-2 text-center">
                      {selectedBook.bookName}
                    </h2>
                    <p className="text-lg">
                      <strong>Price:</strong> Rs {selectedBook.price}
                    </p>
                    <p className="text-lg mb-4">
                      <strong>Pincode:</strong> {selectedBook.pincode}
                    </p>

                    {seller && (
                      <div className="w-full text-left bg-[#393e46] rounded-lg p-4 mb-4 shadow-md">
                        <h3 className="text-xl font-semibold mb-2">
                          Seller Details
                        </h3>
                        <p className="text-lg">
                          <strong>Seller:</strong> {seller.username}
                        </p>
                        <p className="text-lg">
                          <strong>Contact:</strong> {seller.email}  
                        </p>
                        <p className="text-lg">
                          <strong>Pincode:</strong> {selectedBook.pincode}
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => handleBuyRequest(selectedBook)}
                      className="bg-[#FFD369] text-black text-lg font-medium px-6 py-2 rounded-lg hover:bg-[#e0c258] transition duration-300 ease-in-out"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            )}
    </div>
  );
};

export default BookGrid;