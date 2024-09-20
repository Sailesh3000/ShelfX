import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { AppBar, Tabs, Tab, Box } from '@mui/material';

const AdminDashboard = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  ]);

  const [booksUploaded, setBooksUploaded] = useState(50);

  // Sample data for sellers and buyers
  const sellers = [
    { id: 1, name: 'Seller One', email: 'seller1@example.com' },
    { id: 2, name: 'Seller Two', email: 'seller2@example.com' },
  ];

  const buyers = [
    { id: 1, name: 'Buyer One', email: 'buyer1@example.com' },
    { id: 2, name: 'Buyer Two', email: 'buyer2@example.com' },
  ];

  const [activeTab, setActiveTab] = useState(0);

  // Data for Pie Chart
  const userData = [
    { name: 'Admins', value: users.filter(user => user.role === 'Admin').length },
    { name: 'Users', value: users.filter(user => user.role === 'User').length },
  ];

  const COLORS = ['#0088FE', '#00C49F'];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <h2 className='text-2xl tracking-tight font-extrabold mb-2 p-4 text-[#FFD369]'>
        Admin Dashboard
      </h2>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#222831',
          color: '#EEEEEE',
          padding: '2rem',
        }}
      >
        <div style={{ maxWidth: '1200px', width: '100%' }}>
          {/* Chart Container */}
          <div
            style={{
              backgroundColor: '#393E46',
              borderRadius: '8px',
              padding: '2rem',
              boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
              marginTop: '20px',
            }}
          >
            {/* Charts Layout */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {/* User Roles Distribution Pie Chart */}
              <div style={{ flex: '1', marginRight: '1rem' }}>
                <h3 style={{ color: '#FFD369' }}>User Roles Distribution</h3>
                <PieChart width={400} height={400}>
                  <Pie
                    data={userData}
                    cx={200}
                    cy={200}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {userData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>

              {/* Books Uploaded Bar Chart */}
              <div style={{ flex: '1' }}>
                <h3 style={{ color: '#FFD369', marginBottom: '20px' }}>Books Uploaded</h3>
                <BarChart width={400} height={300} data={[{ name: 'Books', count: booksUploaded }]}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#00C49F" />
                </BarChart>
              </div>
            </div>
          </div>

          {/* Tabs for Sellers and Buyers */}
          <Box sx={{ width: '100%', marginTop: '20px' }}>
              <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Sellers" sx={{ color: '#FFFFFF' }} />
              <Tab label="Buyers" sx={{ color: '#FFFFFF' }} />
              </Tabs>
            <TabPanel value={activeTab} index={0}>
              <h4 style={{ color: '#FFD369' }}>Sellers Information</h4>
              <table style={{ width: '100%', color: '#EEE', marginTop: '10px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #EEE', padding: '8px', textAlign: 'left', width: '33%' }}>ID</th>
                    <th style={{ border: '1px solid #EEE', padding: '8px', textAlign: 'left', width: '33%' }}>Name</th>
                    <th style={{ border: '1px solid #EEE', padding: '8px', textAlign: 'left', width: '34%' }}>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {sellers.map(seller => (
                    <tr key={seller.id}>
                      <td style={{ border: '1px solid #EEE', padding: '8px' }}>{seller.id}</td>
                      <td style={{ border: '1px solid #EEE', padding: '8px' }}>{seller.name}</td>
                      <td style={{ border: '1px solid #EEE', padding: '8px' }}>{seller.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <h4 style={{ color: '#FFD369' }}>Buyers Information</h4>
              <table style={{ width: '100%', color: '#EEE', marginTop: '10px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #EEE', padding: '8px', textAlign: 'left', width: '33%' }}>ID</th>
                    <th style={{ border: '1px solid #EEE', padding: '8px', textAlign: 'left', width: '33%' }}>Name</th>
                    <th style={{ border: '1px solid #EEE', padding: '8px', textAlign: 'left', width: '34%' }}>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {buyers.map(buyer => (
                    <tr key={buyer.id}>
                      <td style={{ border: '1px solid #EEE', padding: '8px' }}>{buyer.id}</td>
                      <td style={{ border: '1px solid #EEE', padding: '8px' }}>{buyer.name}</td>
                      <td style={{ border: '1px solid #EEE', padding: '8px' }}>{buyer.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabPanel>
          </Box>
        </div>
      </div>
    </>
  );
};

// TabPanel component
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

export default AdminDashboard;
