import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import {setBuyerDetails} from "../redux/slices/userSlice"

const RequestList = ({ sellerId }) => {
  const dispatch = useDispatch();
  const buyerDetails = useSelector((state) => state.user.buy);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchRequests = async () => {
      if (!sellerId) {
        console.log('No sellerId provided');
        return;
      }
      
      console.log('Fetching requests for sellerId:', sellerId);
      try {
        const response = await axios.get(`https://shelfx-backend.onrender.com/requests/${sellerId}`, {
          withCredentials: true,
        });
        
        console.log('Received response:', response.data);
        
        if (isMounted) {
          setRequests(response.data);

          // Only dispatch buyer details if there is data available
          if (response.data && response.data.length > 0) {
            const firstRequest = response.data[0];
            console.log('First request data:', firstRequest);
            
            dispatch(setBuyerDetails({
              email: firstRequest.email,  // Using email field
              bookName: firstRequest.bookName,
              pincode: firstRequest.pincode,
              state: firstRequest.state,
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
        console.error('Error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRequests();

    return () => {
      isMounted = false;
    };
  }, [sellerId, dispatch]);

  const handleApproveRequest = async (bookId, sellerId, userId) => {
    try {
      console.log('Approving request:', { bookId, sellerId, userId });
      const response = await axios.put(
        "https://shelfx-backend.onrender.com/requests/approve", 
        { 
          bookId,
          sellerId, 
          userId,
          bookName: requests.find(req => req.bookId === bookId)?.bookName,
          buyerEmail: requests.find(req => req.bookId === bookId)?.buyer_email
        },
        { withCredentials: true }
      );
      
      // Remove the approved request from the list
      setRequests((prevRequests) => 
        prevRequests.filter(req => !(req.bookId === bookId && req.userId === userId))
      );

      alert(response.data.message || 'Request approved successfully!');
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Failed to approve request. Please try again.');
    }
  };

  const handleRejectRequest = async (bookId, sellerId, userId) => {
    try {
      console.log('Rejecting request:', { bookId, sellerId, userId });
      await axios.put(
        `https://shelfx-backend.onrender.com/requests/${bookId}/reject`, 
        { sellerId, userId },
        { withCredentials: true }
      );
      
      // Remove the rejected request from the list
      setRequests((prevRequests) => 
        prevRequests.filter(req => !(req.bookId === bookId && req.userId === userId))
      );
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[100px]">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="mt-8 p-8">
      <h3 className="text-2xl font-extrabold text-[#393E46] mb-6">Manage Rental Requests</h3>
      <div className="flex flex-wrap gap-6 justify-start">
        {requests.length > 0 ? (
          requests.map((request) => (
            <div
              key={request.bookId}
              className="flex flex-col items-start border border-gray-200 p-6 rounded-lg shadow-lg bg-white w-full sm:w-[350px] md:w-[400px]"
            >
              <h4 className="text-xl font-semibold mb-2">{request.bookName}</h4>
              <div className="mt-2 mb-4 space-y-1 text-sm text-gray-700">
                <p><strong>Buyer Email:</strong> {request.buyer_email}</p>
                <p><strong>Pincode:</strong> {request.pincode}</p>
                <p><strong>State:</strong> {request.state}</p>
              </div>
              <div className="mt-auto">
                {request.status !== 'APPROVED' && request.status !== 'REJECTED' ? (
                  <>
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                      onClick={() => handleApproveRequest(
                        request.bookId, 
                        request.sellerId, 
                        request.userId
                      )}
                    >
                      Approve
                    </button>
                    <button
                      className="ml-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                      onClick={() => handleRejectRequest(request.bookId, request.sellerId, request.userId)}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <p className="text-gray-600">{`Request ${request.status}`}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No requests available.</p>
        )}
      </div>
    </div>
  );
};

export default RequestList;
