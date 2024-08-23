const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from React build directory
app.use(express.static(path.join(__dirname, 'build')));

// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ShelfX'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database.');
});

// Handle POST request to register a new user
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      return res.status(500).send('Server error');
    }

    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(sql, [username, email, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        return res.status(500).send('Server error');
      }
      res.status(200).send('Registration successful');
    });
  });
});

// Handle POST request for login
app.post('/Login', (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT username, password FROM users WHERE username = ?';
  db.query(sql, [username], (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).send('Server error');
    }

    if (result.length === 0) {
      return res.status(401).send('Invalid username or password');
    }

    const hashedPassword = result[0].password;

    bcrypt.compare(password, hashedPassword, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).send('Server error');
      }

      if (isMatch) {
        res.status(200).send('successful');
      } else {
        res.status(401).send('Invalid username or password');
      }
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
