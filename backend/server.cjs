const express = require("express");
const path = require("path");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const session = require('express-session');
const multer = require("multer");

const app = express();
const port = 5000;

// Global variable to store the user ID
let globalUserId = null;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory session store
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 24 * 60 * 60 * 1000,
    sameSite: 'None',
    secure: false
  }
}));

// Serve static files from React build directory
app.use(express.static(path.join(__dirname, 'build')));
app.use((req, res, next) => {
  console.log("Session data:", req.session);
  next();
});

// Setup Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "ShelfX",
});

// Sign up endpoint
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
    console.error("Error registering user:", err);
    res.status(500).send("Server error");
  }
});

// Login endpoint
app.post('/LoginSeller', async (req, res) => {
  const { email, password } = req.body;

  try {
    const sql = 'SELECT id, email, password FROM users WHERE email = ?';
    const [rows] = await db.query(sql, [email]);

    if (rows.length === 0) {
      return res.status(401).send('Invalid email or password');
    }

    const hashedPassword = rows[0].password;
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (isMatch) {
      globalUserId = rows[0].id; // Store user ID in the global variable
      req.session.userId = globalUserId; // Store user ID in session for fallback
      req.session.save(err => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).send('Server error');
        }
        res.status(200).send('Login successful');
      });
    } else {
      res.status(401).send('Invalid email or password');
    }
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).send("Server error");
  }
});

app.post('/uploadBook', upload.single('image'), async (req, res) => {
  const userId = globalUserId;

  if (!userId) {
    return res.status(401).send('User not authenticated. Please log in.');
  }

  // Get the user's subscription
  const [subscriptionRows] = await db.query('SELECT plan FROM subscriptions WHERE userId = ?', [userId]);
  const userPlan = subscriptionRows[0]?.plan;

  if (!userPlan) {
    return res.status(403).json({ redirect: 'http://localhost:5173/subscription' });
}

  const uploadLimits = {
    free: 5,
    starter: 50,
    premium: Infinity
  };

  const [bookCountRows] = await db.query('SELECT COUNT(*) as count FROM books WHERE userId = ?', [userId]);
  const currentUploadCount = bookCountRows[0].count;

  if (currentUploadCount >= uploadLimits[userPlan]) {
    return res.status(403).json({ redirect: 'http://localhost:5173/subscription' });
  }

  const { address, pincode, price } = req.body;
  const image = req.file;

  if (!image) {
    return res.status(400).send('No image provided');
  }

  try {
    const imageBuffer = image.buffer;

    const sql = 'INSERT INTO books (address, pincode, price, imageData, userId) VALUES (?, ?, ?, ?, ?)';
    await db.query(sql, [address, pincode, price, imageBuffer, userId]);
    res.status(200).send('Book uploaded successfully');
  } catch (err) {
    console.error("Error uploading book:", err);
    res.status(500).send("Server error");
  }
});



// Subscription endpoint
app.post('/subscribe/:selectedPlan', async (req, res) => {
  const { selectedPlan } = req.params; 
  const userId = globalUserId;

  if (!userId) {
    return res.status(401).send('User not authenticated');
  }

  try {
    const sql = 'INSERT INTO subscriptions (userId, plan) VALUES (?, ?)';
    await db.query(sql, [userId, selectedPlan]);
    res.status(200).send('Subscription successful');
  } catch (err) {
    console.error("Error subscribing user:", err);
    res.status(500).send('Server error');
  }
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
