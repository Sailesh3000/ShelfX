import React, { useEffect, useState } from "react";
import axios from "axios";

// Card Component for displaying request details
const Card = ({ name, time, amount, date, status }) => {
  let statusColor;
  switch (status) {
    case "ACCEPTED":
      statusColor = "bg-green-100 text-green-700";
      break;
    case "DECLINED":
      statusColor = "bg-blue-100 text-blue-700";
      break;
    default:
      statusColor = "bg-white-100 text-pink-700";
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h3 className="text-lg font-semibold">{name}</h3>
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <span className="material-icons">schedule</span>
        <span>{time}</span>
        <span className="ml-auto">{amount}</span>
      </div>
      <p className="text-sm text-gray-500">{date}</p>
      <div className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
        {status}
      </div>
    </div>
  );
};

const HistoryDashboard = () => {
  const [req, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/requests/status`, {
          withCredentials: true,
        });
        setRequests(response.data.requests);
      } catch (err) {
        setError(err.response?.data?.message || err.message); // More detailed error handling
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>; // Consider using a spinner here
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">History</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
};

export default HistoryDashboard;
