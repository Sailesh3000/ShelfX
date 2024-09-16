const express = require("express");
const path = require("path");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "build")));

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "ShelfX",
});

app.post("/login-seller", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql =
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    await db.query(sql, [username, email, hashedPassword]);

    res.status(200).send("Registration successful");
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).send("Server error");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const sql = "SELECT username, password FROM users WHERE username = ?";
    const [rows] = await db.query(sql, [username]);

    if (rows.length === 0) {
      return res.status(401).send("Invalid username or password");
    }

    const hashedPassword = rows[0].password;

    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (isMatch) {
      res.status(200).send("Login successful");
    } else {
      res.status(401).send("Invalid username or password");
    }
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).send("Server error");
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
