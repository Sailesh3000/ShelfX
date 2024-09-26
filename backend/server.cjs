const express = require("express");
const path = require("path");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");
const multer = require("multer");

const app = express();
const port = 5000;

// Global variable to store the user ID
let globalUserId = null;

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory session store
app.use(
  session({
    secret: "asdg34NJSQKK78",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: false,
    },
  })
);

// Serve static files from React build directory
app.use(express.static(path.join(__dirname, "build")));
app.use((req, res, next) => {
  console.log("Session data:", req.session);
  next();
});

// Create MySQL connection pool
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "ShelfX",
});

// Sign up endpoint
app.post("/SignupSeller", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    const sql =
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    await db.query(sql, [username, email, hashedPassword]);

    res.status(200).send("Registration successful");
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).send("Server error");
  }
});

// Login endpoint
app.post("/LoginSeller", async (req, res) => {
  const { email, password } = req.body;

  try {
    const sql = "SELECT id, email, password FROM users WHERE email = ?";
    const [rows] = await db.query(sql, [email]);

    if (rows.length === 0) {
      return res.status(401).send("Invalid email or password");
    }

    const hashedPassword = rows[0].password;
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (isMatch) {
      globalUserId = rows[0].id;
      req.session.userId = globalUserId;
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).send("Server error");
        }
        res.status(200).send("Login successful");
      });
    } else {
      res.status(401).send("Invalid email or password");
    }
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).send("Server error");
  }
});

app.post("/uploadBook", upload.single("image"), async (req, res) => {
  const userId = globalUserId;

  if (!userId) {
    return res.status(401).send("User not authenticated. Please log in.");
  }

  // Get the user's subscription
  const [subscriptionRows] = await db.query(
    "SELECT plan FROM subscriptions WHERE userId = ?",
    [userId]
  );
  const userPlan = subscriptionRows[0]?.plan;

  if (!userPlan) {
    return res
      .status(403)
      .json({ redirect: "http://localhost:5173/subscription" });
  }

  const uploadLimits = {
    free: 5,
    starter: 50,
    premium: Infinity,
  };

  const [bookCountRows] = await db.query(
    "SELECT COUNT(*) as count FROM books WHERE userId = ?",
    [userId]
  );
  const currentUploadCount = bookCountRows[0].count;

  if (currentUploadCount >= uploadLimits[userPlan]) {
    return res
      .status(403)
      .json({ redirect: "http://localhost:5173/subscription" });
  }

  const { bookName, address, pincode, price } = req.body;
  const image = req.file;

  if (!image) {
    return res.status(400).send("No image provided");
  }

  try {
    const imageBuffer = image.buffer;

    const sql =
      "INSERT INTO books (address, pincode, price, imageData, userId, bookName) VALUES (?, ?, ?, ?, ?, ?)";
    await db.query(sql, [
      address,
      pincode,
      price,
      imageBuffer,
      userId,
      bookName,
    ]);
    res.status(200).send("Book uploaded successfully");
  } catch (err) {
    console.error("Error uploading book:", err);
    res.status(500).send("Server error");
  }
});

// User details endpoint
app.get("/details", async (req, res) => {
  const userId = globalUserId; // Get user ID from UserSession

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    // Fetch user details
    const sqlUser = "SELECT * FROM users WHERE id = ?";
    const [rowsUser] = await db.query(sqlUser, [userId]);

    if (rowsUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rowsUser[0]; // Assuming there is only one user with that ID

    // Fetch user's books
    const sqlBooks =
      "SELECT id,bookname, address, pincode, price, imageData FROM books WHERE userId = ?";
    const [rowsBooks] = await db.query(sqlBooks, [userId]);

    const books = rowsBooks.map((book) => ({
      address: book.address,
      pincode: book.pincode,
      price: book.price,
      id: book.id,
      bookName: book.bookname,
      imageUrl: book.imageData
        ? `data:image/jpeg;base64,${book.imageData.toString("base64")}`
        : null,
    }));

    // Send user and books data back to the client
    res.json({ user: { username: user.username, id: user.id }, books });
  } catch (err) {
    console.error("Error fetching current user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Subscription endpoint
app.post("/subscribe/:selectedPlan", async (req, res) => {
  const { selectedPlan } = req.params;
  const userId = globalUserId;

  if (!userId) {
    return res.status(401).send("User not authenticated");
  }

  try {
    const sql = "INSERT INTO subscriptions (userId, plan) VALUES (?, ?)";
    await db.query(sql, [userId, selectedPlan]);
    res.status(200).send("Subscription successful");
  } catch (err) {
    console.error("Error subscribing user:", err);
    res.status(500).send("Server error");
  }
});

// Logout endpoint
app.post("/logout", (req, res) => {
  req.session.destroy();
  res.status(200).send("Logout successful");
});
///////////////////////////////////////////////////----------BUYER----------/////////////////////////////////////////////////////////

app.post("/SignupBuyer", async (req, res) => {
  const { username, email, password, pincode, state } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    const sql =
      "INSERT INTO buyers (username, email, password,pincode,state) VALUES (?, ?, ?,?,?)";
    await db.query(sql, [username, email, hashedPassword, pincode, state]);

    res.status(200).send("Registration successful");
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).send("Server error");
  }
});

app.post("/LoginBuyer", async (req, res) => {
  const { email, password } = req.body;

  try {
    const sql = "SELECT id, password FROM buyers WHERE email = ?";
    const [rows] = await db.query(sql, [email]);

    if (rows.length === 0) {
      return res.status(401).send("Invalid email or password");
    }

    const hashedPassword = rows[0].password;
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (isMatch) {
      if (isMatch) {
        globalUserId = rows[0].id; // Store user ID in the global variable
        req.session.userId = globalUserId; // Store user ID in session for fallback
        req.session.save((err) => {
          if (err) {
            console.error("Session save error:", err);
            return res.status(500).send("Server error");
          }
          res.status(200).send("Login successful");
        });
      } else {
        res.status(401).send("Invalid email or password");
      }
    }
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).send("Server error");
  }
});

app.get("/explore", async (req, res) => {
  const userId = globalUserId; // Get user ID from UserSession
  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    // Fetch user details
    const sqlUser = "SELECT username,pincode FROM buyers WHERE id = ?";
    const [rowsUser] = await db.query(sqlUser, [userId]);

    if (rowsUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rowsUser[0]; // Assuming there is only one user with that ID

    // Fetch user's books
    const sqlBooks =
      "SELECT id,userId,bookname, address, pincode, price, imageData FROM books";
    const [rowsBooks] = await db.query(sqlBooks);

    const books = rowsBooks.map((book) => ({
      address: book.address,
      pincode: book.pincode,
      price: book.price,
      id: book.id,
      userId: book.userId,
      bookName: book.bookname,
      imageUrl: book.imageData
        ? `data:image/jpeg;base64,${book.imageData.toString("base64")}`
        : null,
    }));

    res.json({ user: { username: user.username }, books });
  } catch (err) {
    console.error("Error fetching current user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/sellerdetails/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const sql = "SELECT * FROM users WHERE id = ?";
    const [rowsUser] = await db.query(sql, [userId]);

    if (rowsUser.length === 0) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const seller = rowsUser[0];
    res.json({
      user: {
        userId: seller.id,
        username: seller.username,
        email: seller.email,
      },
    });
  } catch (err) {
    console.error("Error fetching seller details:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/deleteBook/:id", async (req, res) => {
  const bookId = req.params.id;
  const userId = globalUserId;

  try {
    const sqlDelete = "DELETE FROM books WHERE id = ? AND userId = ?";
    const [result] = await db.query(sqlDelete, [bookId, userId]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Book not found or user not authorized" });
    }

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error("Error deleting book:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/// ---------------->  FOR ADMIN  <----------------------------------
// Get sellers
app.get("/sellers", async (req, res) => {
  try {
    const sql = "SELECT id, username, email FROM users";
    const [rows] = await db.query(sql);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching sellers:", err);
    res.status(500).send("Server error");
  }
});

app.get("/buyers", async (req, res) => {
  try {
    const sql = "SELECT id, username, email FROM buyers";
    const [rows] = await db.query(sql);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching sellers:", err);
    res.status(500).send("Server error");
  }
});

app.get("/subscriptions", async (req, res) => {
  try {
    const sql = "SELECT id, userId, plan FROM subscriptions";
    const [rows] = await db.query(sql);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching sellers:", err);
    res.status(500).send("Server error");
  }
});


// Update seller
app.put("/seller/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;

  try {
    const sql = "UPDATE users SET username = ?, email = ? WHERE id = ?";
    await db.query(sql, [username, email, id]);
    res.status(200).send("Seller updated successfully");
  } catch (err) {
    console.error("Error updating seller:", err);
    res.status(500).send("Server error");
  }
});

app.put("/buyer/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;

  try {
    const sql = "UPDATE buyers SET username = ?, email = ? WHERE id = ?";
    await db.query(sql, [username, email, id]);
    res.status(200).send("Buyer updated successfully");
  } catch (err) {
    console.error("Error updating buyer:", err);
    res.status(500).send("Server error");
  }
});

// Delete seller
app.delete("/seller/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const sql = "DELETE FROM users WHERE id = ?";
    await db.query(sql, [id]);
    res.status(200).send("Seller deleted successfully");
  } catch (err) {
    console.error("Error deleting seller:", err);
    res.status(500).send("Server error");
  }
});

app.delete("/buyer/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const sql = "DELETE FROM buyers WHERE id = ?";
    await db.query(sql, [id]);
    res.status(200).send("Seller deleted successfully");
  } catch (err) {
    console.error("Error deleting seller:", err);
    res.status(500).send("Server error");
  }
});

app.get("/books/count", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT COUNT(*) as count FROM books");
    res.json({ count: rows[0].count });
  } catch (err) {
    console.error("Error fetching book count:", err);
    res.status(500).send("Server error");
  }
});

app.get("/countSellers", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT COUNT(*) as count FROM users");
    res.json({ count: rows[0].count });
  } catch (err) {
    console.error("Error fetching book count:", err);
    res.status(500).send("Server error");
  }
});

app.get("/countBuyers", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT COUNT(*) as count FROM buyers");
    res.json({ count: rows[0].count });
  } catch (err) {
    console.error("Error fetching book count:", err);
    res.status(500).send("Server error");
  }
});

app.post("/request", async (req, res) => {
  const { bookId, sellerId } = req.body;
  const userId = globalUserId;

  if (!userId) {
    return res.status(401).send("User not authenticated");
  }

  try {
    const sql =
      "INSERT INTO request (userId, bookId, sellerId) VALUES (?, ?, ?)";
    await db.query(sql, [userId, bookId, sellerId]);
    res.status(201).send("Request created successfully");
  } catch (err) {
    console.error("Error creating request:", err);
    res.status(500).send("Server error");
  }
});

app.get("/requests/:sellerId", async (req, res) => {
  const { sellerId } = req.params;

  try {
    const sql = `
  SELECT 
      r.id,
      r.bookId,
      b.id,
      b.pincode,
      b.state,
      b.email,
      bk.id,
      bk.bookName,
      s.id
  FROM 
      request r
  JOIN 
      buyers b ON r.userId = b.id
  JOIN 
      books bk ON r.bookId = bk.id
  JOIN 
      users s ON r.sellerId = s.id
  WHERE 
      r.sellerId = ? AND status="PENDING";
`;

    const [rows] = await db.query(sql, [sellerId]);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).send("Server error");
  }
});

app.put("/requests/:bookId/approve", async (req, res) => {
  try {
    const { bookId } = req.params;
    const { sellerId } = req.body;

    // Assuming you have a 'requests' table and a 'status' column in your DB
    const updateRequest = await db.query(
      "UPDATE request SET status = ? WHERE bookId = ? AND sellerId = ?",
      ["APPROVED", bookId, sellerId]
    );

    res.json({ message: "Request approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error approving request", error });
  }
});

app.put("/requests/:bookId/reject", async (req, res) => {
  try {
    const { bookId } = req.params;
    const { sellerId } = req.body;

    const updateRequest = await db.query(
      "UPDATE request SET status = ? WHERE bookId = ? AND sellerId = ?",
      ["REJECTED", bookId, sellerId]
    );

    res.json({ message: "Request rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting request", error });
  }
});

app.get("/status", async (req, res) => {

  const userId = globalUserId; // Ensure this globalUserId is set somewhere
  console.log(`hello${userId}o`);
  console.log(userId); // For debugging, check if userId is correctly logged
  if (!userId) {
    return res.status(400).json({ message: "Buyer ID is required" });
  }
  try {
    // First Query: Fetch requests for the user
    const requestSql = `
      SELECT bookId, requestDate, status 
      FROM request 
      WHERE userId = ?`;

    const [requestRows] = await db.query(requestSql, [userId]);

    if (requestRows.length === 0) {
      return res
        .status(404)
        .json({ message: "No requests found for this buyer" });
    }

    // Extract the book IDs from the request results
    const bookIds = requestRows.map((row) => row.bookId);

    // Second Query: Fetch book details for the bookIds
    const bookSql = `
      SELECT id as bookId, bookName, price 
      FROM books 
      WHERE id IN (?)`;

    const [bookRows] = await db.query(bookSql, [bookIds]);

    // Create a map for quick lookup of book details
    const bookMap = {};
    bookRows.forEach((book) => {
      bookMap[book.bookId] = {
        bookName: book.bookName,
        bookPrice: book.price,
      };
    });

    // Combine request and book details
    const requests = requestRows.map((row) => ({
      bookId: row.bookId,
      bookName: bookMap[row.bookId]?.bookName || "Unknown", // Check if book exists
      bookPrice: bookMap[row.bookId]?.bookPrice || 0, // Default price to 0 if not found
      date: row.requestDate,
      status: row.status,
    }));

    res.json({requests});
  } catch (err) {
    console.error("Error fetching request details:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
