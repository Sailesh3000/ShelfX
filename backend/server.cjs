const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const multer = require('multer'); // Import multer for file uploads

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory session store
app.use(session({
  secret: 'your_secret_key', // Replace with your secret key
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve static files from React build directory
app.use(express.static(path.join(__dirname, 'build')));

// Create a MySQL connection pool
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ShelfX'
});

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory
  limits: { fileSize: 10 * 1024 * 1024 } // Limit file size to 10MB
});
app.use(cors({
  origin: 'http://localhost:5173', // Frontend origin
  credentials: true, // Allow credentials (cookies) to be sent
}));
// Handle POST request to register a new user
app.post('/SignupSeller', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    await db.query(sql, [username, email, hashedPassword]);

    res.status(200).send('Registration successful');
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).send('Server error');
  }
});

// Handle POST request for login
app.post('/LoginSeller', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const sql = 'SELECT id, email, password FROM users WHERE email = ?';
    const [rows] = await db.query(sql, [email]);

    if (rows.length === 0) {
      return res.status(401).send('Invalid email or password');
    }

    // Compare the password with the hashed password
    const hashedPassword = rows[0].password;
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (isMatch) {
      // Store user info in session
      req.session.user = { id: rows[0].id, email }; // Store user ID and email
      res.status(200).send('Login successful');
    } else {
      res.status(401).send('Invalid email or password');
    }
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).send('Server error');
  }
});

// Handle POST request for logout
app.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send('Logout failed');
      }
      res.status(200).send('Logout successful');
    });
  } else {
    res.status(400).send('No active session');
  }
});

// Handle file upload
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.session.user || !req.file) {
    return res.status(400).send('No file or user session');
  }

  const userId = req.session.user.id;
  const filename = req.file.originalname;
  const filedata = req.file.buffer;

  try {
    const sql = 'INSERT INTO files (user_id, filename, filedata) VALUES (?, ?, ?)';
    await db.query(sql, [userId, filename, filedata]);

    res.status(200).send('File uploaded successfully');
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).send('Server error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
