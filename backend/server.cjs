const express = require("express");
const path = require("path");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
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

// Create MySQL connection pool
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

// Upload book endpoint
app.post('/uploadBook', upload.single('image'), async (req, res) => {
  const { address, pincode, price } = req.body;
  const image = req.file;
  const userId = UserSession.userId; // Get user ID from UserSession

  if (!address || !pincode || !price) {
    return res.status(400).send('Please fill in all fields');
  }

  if (!image) {
    return res.status(400).send('No image provided');
  }

  if (!userId) {
    return res.status(401).send('User not authenticated');
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

// User details endpoint
app.get('/details', async (req, res) => {
  const userId = UserSession.userId; // Get user ID from UserSession

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    // Fetch user details
    const sqlUser = 'SELECT username FROM users WHERE id = ?';
    const [rowsUser] = await db.query(sqlUser, [userId]);

    if (rowsUser.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rowsUser[0]; // Assuming there is only one user with that ID

    // Fetch user's books
    const sqlBooks = 'SELECT id, address, pincode, price, imageData FROM books WHERE userId = ?';
    const [rowsBooks] = await db.query(sqlBooks, [userId]);

    const books = rowsBooks.map(book => ({
      address: book.address,
      pincode: book.pincode,
      price: book.price,
      id: book.id,
      imageUrl: book.imageData ? `data:image/jpeg;base64,${book.imageData.toString('base64')}` : null,
    }));

    // Send user and books data back to the client
    res.json({ user: { username: user.username }, books });
  } catch (err) {
    console.error('Error fetching current user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/deleteBook/:id', async (req, res) => {
  const bookId = req.params.id;
  const userId = UserSession.userId; // Adjust this to get the current user's ID

  try {
    const sqlDelete = 'DELETE FROM books WHERE id = ? AND userId = ?';
    const [result] = await db.query(sqlDelete, [bookId, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Book not found or user not authorized' });
    }

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error('Error deleting book:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Logout endpoint
app.post('/logout', (req, res) => {
  UserSession.clear(); // Clear the global user ID
  res.status(200).send('Logout successful');
});
///////////////////////////////////////////////////----------BUYER----------/////////////////////////////////////////////////////////

app.post('/SignupBuyer',async(req,res)=>{
  const { username, email, password ,pincode,state} = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    const sql = 'INSERT INTO buyers (username, email, password,pincode,state) VALUES (?, ?, ?,?,?)';
    await db.query(sql, [username, email, hashedPassword,pincode,state]);

    res.status(200).send('Registration successful');
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).send("Server error");
  }
});

app.post('/LoginBuyer', async (req, res) => {
  const { email, password } = req.body;

  try {
    const sql = 'SELECT id, password FROM buyers WHERE email = ?';
    const [rows] = await db.query(sql, [email]);

    if (rows.length === 0) {
      return res.status(401).send('Invalid email or password');
    }

    const hashedPassword = rows[0].password;
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (isMatch) {
      UserSession.userId = rows[0].id; 
      console.log(req.UserSession);// Set user ID using UserSession
      res.status(200).send('Login successful');
    } else {
      res.status(401).send('Invalid email or password');
    }
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).send("Server error");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
