import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Ensure this is imported
import { FaUserCircle } from 'react-icons/fa'; 
import axios from 'axios'; // Ensure axios is imported

const SellerProfile = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [file, setFile] = useState(null);

    const handleLogout = async () => {
        try {
            const response = await axios.post('http://localhost:5000/logout', {}, {
                withCredentials: true, // Ensure credentials (cookies) are sent
            });
            if (response.status === 200) {
                alert("Logout successful");
                navigate('/');
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // Set the selected file
    };

    const handleUpload = async () => {
        if (!file) return;
    
        const formData = new FormData();
        formData.append('file', file);
    
        try {
            const res = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true, // Include credentials (cookies) in the request
            });
            alert('File uploaded successfully');
        } catch (err) {
            console.error('Error uploading file:', err);
            alert('File upload failed');
        }
    };
    
    return (
        <div className="min-h-screen bg-[#EEEEEE]">
            <nav className="bg-[#393E46] text-white px-8 py-4 flex items-center">
                <div className="text-2xl font-bold mr-80">ShelfX</div>
                <div className="space-x-6 ml-60 mr-80">
                    <a href="#" className="hover:text-[#FFD369]">Home</a>
                    <a href="#" className="text-gray-500 cursor-default">My Books</a>
                </div>
                <div className="flex items-center space-x-4 ml-40 mr-5">
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

            <div className="p-8 flex flex-wrap gap-4">
                <div className="flex flex-wrap gap-4 w-full lg:w-3/4">
                    <div className="bg-[#393E46] text-white flex flex-col items-center justify-center w-52 h-36 rounded-md shadow-md">
                        <button
                            className="text-[#FFD369] font-semibold"
                            onClick={() => document.getElementById('fileInput').click()}
                        >
                            Upload a book
                        </button>
                        <input
                            id="fileInput"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <button
                            type="button"
                            onClick={handleUpload}
                            className="text-[#FFD369] font-semibold mt-2"
                        >
                            Upload
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
        </div>
    );
};

export default SellerProfile;
