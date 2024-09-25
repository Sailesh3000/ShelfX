import React, { useState, useEffect } from "react";
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
} from "recharts";
import {
  Tabs,
  Tab,
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
  ]);
  const [sellers, setSellers] = useState([]);
  const [booksUploaded, setBooksUploaded] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [editSeller, setEditSeller] = useState(null);
  const [open, setOpen] = useState(false);

  // Fetch sellers from the users table
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/sellers");
        setSellers(response.data);
      } catch (err) {
        console.error("Error fetching sellers:", err);
      }
    };

    const fetchBooksCount = async () => {
      try {
        const response = await axios.get("http://localhost:5000/books/count");
        setBooksUploaded(response.data.count);
      } catch (err) {
        console.error("Error fetching books count:", err);
      }
    };

    fetchSellers();
    fetchBooksCount();
  }, []);

  // Data for Pie Chart
  const userData = [
    {
      name: "Admins",
      value: users.filter((user) => user.role === "Admin").length,
    },
    {
      name: "Users",
      value: users.filter((user) => user.role === "User").length,
    },
  ];

  const COLORS = ["#0088FE", "#00C49F"];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEditClick = (seller) => {
    setEditSeller(seller);
    setOpen(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/seller/${id}`);
      setSellers(sellers.filter((seller) => seller.id !== id));
    } catch (err) {
      console.error("Error deleting seller:", err);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:5000/seller/${editSeller.id}`,
        editSeller
      );
      setSellers(
        sellers.map((seller) =>
          seller.id === editSeller.id ? editSeller : seller
        )
      );
      setOpen(false);
      setEditSeller(null);
    } catch (err) {
      console.error("Error saving seller:", err);
    }
  };

  return (
    <>
      <h2 className="text-2xl tracking-tight font-extrabold mb-2 p-4 text-[#FFD369]">
        Admin Dashboard
      </h2>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#222831",
          color: "#EEEEEE",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "1200px", width: "100%" }}>
          {/* Chart Container */}
          <div
            style={{
              backgroundColor: "#393E46",
              borderRadius: "8px",
              padding: "2rem",
              boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)",
              marginTop: "20px",
            }}
          >
            {/* Charts Layout */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {/* User Roles Distribution Pie Chart */}
              <div style={{ flex: "1", marginRight: "1rem" }}>
                <h3 style={{ color: "#FFD369" }}>User Roles Distribution</h3>
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
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>

              {/* Books Uploaded Bar Chart */}
              <div style={{ flex: "1" }}>
                <h3 style={{ color: "#FFD369", marginBottom: "60px" }}>
                  Books Uploaded
                </h3>
                <BarChart
                  width={400}
                  height={300}
                  data={[{ name: "Books", count: booksUploaded }]}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#00C49F" />
                </BarChart>
              </div>
            </div>
          </div>

          {/* Tabs for Sellers and Buyers */}
          <Box sx={{ width: "100%", marginTop: "20px" }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Sellers" sx={{ color: "#FFFFFF" }} />
            </Tabs>
            <TabPanel value={activeTab} index={0}>
              <h4 style={{ color: "#FFD369" }}>Sellers Information</h4>
              <table
                style={{
                  width: "100%",
                  color: "#EEE",
                  marginTop: "10px",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        border: "1px solid #EEE",
                        padding: "8px",
                        textAlign: "left",
                        width: "20%",
                      }}
                    >
                      ID
                    </th>
                    <th
                      style={{
                        border: "1px solid #EEE",
                        padding: "8px",
                        textAlign: "left",
                        width: "30%",
                      }}
                    >
                      Name
                    </th>
                    <th
                      style={{
                        border: "1px solid #EEE",
                        padding: "8px",
                        textAlign: "left",
                        width: "30%",
                      }}
                    >
                      Email
                    </th>
                    <th
                      style={{
                        border: "1px solid #EEE",
                        padding: "8px",
                        textAlign: "center",
                        width: "20%",
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sellers.map((seller) => (
                    <tr key={seller.id}>
                      <td style={{ border: "1px solid #EEE", padding: "8px" }}>
                        {seller.id}
                      </td>
                      <td style={{ border: "1px solid #EEE", padding: "8px" }}>
                        {seller.username}
                      </td>
                      <td style={{ border: "1px solid #EEE", padding: "8px" }}>
                        {seller.email}
                      </td>
                      <td
                        style={{
                          border: "1px solid #EEE",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        <Button
                          variant="contained"
                          onClick={() => handleEditClick(seller)}
                          sx={{ padding: "4px", marginRight: "8px" }} // Add margin here
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDeleteClick(seller.id)}
                          sx={{ padding: "4px" }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabPanel>
          </Box>

          {/* Edit Seller Dialog */}
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            sx={{
              "& .MuiDialog-paper": {
                backgroundColor: "#393E46", // Match the background color
                color: "#EEEEEE", // Match the text color
                borderRadius: "8px",
                padding: "1rem",
              },
            }}
          >
            <DialogTitle sx={{ color: "#FFD369" }}>Edit Seller</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="UserName"
                type="text"
                fullWidth
                value={editSeller?.username || ""}
                onChange={(e) =>
                  setEditSeller({ ...editSeller, username: e.target.value })
                }
                sx={{
                  "& .MuiInputBase-input": {
                    backgroundColor: "#444B54", // Input field background
                    color: "#EEEEEE", // Input text color
                  },
                  "& .MuiInputLabel-root": {
                    color: "#FFD369", // Label color
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#FFD369", // Focused label color
                  },
                  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                    borderColor: "#FFD369", // Border color on focus
                  },
                }}
              />
              <TextField
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                value={editSeller?.email || ""}
                onChange={(e) =>
                  setEditSeller({ ...editSeller, email: e.target.value })
                }
                sx={{
                  "& .MuiInputBase-input": {
                    backgroundColor: "#444B54", // Input field background
                    color: "#EEEEEE", // Input text color
                  },
                  "& .MuiInputLabel-root": {
                    color: "#FFD369", // Label color
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#FFD369", // Focused label color
                  },
                  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                    borderColor: "#FFD369", // Border color on focus
                  },
                }}
              />
            </DialogContent>
            <DialogActions
              sx={{
                backgroundColor: "#393E46",
                borderTop: "1px solid #444B54",
              }}
            >
              <Button onClick={() => setOpen(false)} sx={{ color: "#FFD369" }}>
                Cancel
              </Button>
              <Button onClick={handleSave} sx={{ color: "#FFD369" }}>
                Save
              </Button>
            </DialogActions>
          </Dialog>
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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export default AdminDashboard;
