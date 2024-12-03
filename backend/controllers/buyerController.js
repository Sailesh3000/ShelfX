import bcrypt from "bcrypt";
import db from "../db.js";

let globalUserId = null;

export const signupBuyer = async (req, res) => {
  const { username, email, password, pincode, state } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO buyers (username, email, password, pincode, state) VALUES (?, ?, ?, ?, ?)";
    await db.query(sql, [username, email, hashedPassword, pincode, state]);
    res.status(200).send("Registration successful");
  } catch (err) {
    console.error("Error registering buyer:", err);
    res.status(500).send("Server error");
  }
};

export const loginBuyer = async (req, res) => {
  const { email, password } = req.body;
  try {
    const sql = "SELECT id, password FROM buyers WHERE email = ?";
    const [rows] = await db.query(sql, [email]);
    if (rows.length === 0) return res.status(401).send("Invalid email or password");

    const isMatch = await bcrypt.compare(password, rows[0].password);
    if (isMatch) {
      globalUserId = rows[0].id;
      req.session.userId = globalUserId;
      req.session.save(err => {
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
    console.error("Error logging in buyer:", err);
    res.status(500).send("Server error");
  }
};

export const exploreBuyer = async (req, res) => {
    const userId = globalUserId; // Get user ID from UserSession
  
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
  
    try {
      // Fetch user details
      const sql = 'SELECT * FROM buyers WHERE id = ?';
      const [rowsUser] = await db.query(sql, [userId]);
  
      if (rowsUser.length === 0) {
        return res.status(404).json({ message: 'Seller not found' });
      }
  
      const user = rowsUser[0];  
  
      const sqlBooks = 'SELECT id,userId,bookname, address, pincode, price, imageData FROM books';
      const [rowsBooks] = await db.query(sqlBooks);
  
      const books = rowsBooks.map(book => ({
        address: book.address,
        pincode: book.pincode,
        price: book.price,
        id: book.id,
        userId:book.userId,
        bookName:book.bookname,
        imageUrl: book.imageData ? `data:image/jpeg;base64,${book.imageData.toString('base64')}` : null,
      }));
  
      res.json({ user, books });
    } catch (err) {
      console.error('Error fetching current user:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };

export const getBuyers = async (req, res) => {
  try {
    const sql = "SELECT id, username, email FROM buyers";
    const [rows] = await db.query(sql);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching buyers:", err);
    res.status(500).send("Server error");
  }
};

export const postRequest = async (req, res) => {
    const { bookId, sellerId } = req.body;
    const userId = globalUserId;

    if (!userId) {
        return res.status(401).send("User not authenticated");
    }

    try {
        const sql = "INSERT INTO request (userId, bookId, sellerId) VALUES (?, ?, ?)";
        await db.query(sql, [userId, bookId, sellerId]);
        res.status(201).send("Request created successfully");
    } catch (err) {
        console.error("Error creating request:", err);
        res.status(500).send("Server error");
    }
};


export const updateBuyer = async (req, res) => {
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
};

export const deleteBuyer = async (req, res) => {
  const { id } = req.params;

  try {
    const sql = "DELETE FROM buyers WHERE id = ?";
    await db.query(sql, [id]);
    res.status(200).send("Buyer deleted successfully");
  } catch (err) {
    console.error("Error deleting buyer:", err);
    res.status(500).send("Server error");
  }
};

export const countBuyers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT COUNT(*) as count FROM buyers");
    res.json({ count: rows[0].count });
  } catch (err) {
    console.error("Error fetching buyer count:", err);
    res.status(500).send("Server error");
  }
};

export const editBuyerProfile = async (req, res) => {
    const userId = globalUserId; 
    const { username,newPassword } = req.body; 
  
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
  if(newPassword == null){
    try {
      const sql = 'UPDATE buyers SET username = ? WHERE id = ?';
      const [result] = await db.query(sql, [username, userId]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ message: 'Username updated successfully' });
    } catch (err) {
      console.error('Error updating username:', err);
      res.status(500).json({ message: 'Server error' });
    }}
    else{ try {
      const hashedPassword = await bcrypt.hash(newPassword, 10); 
      const sql = 'UPDATE buyers SET password = ? WHERE id = ?';
      const [result] = await db.query(sql, [hashedPassword, userId]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ message: 'Password updated successfully' });
    } catch (err) {
      console.error('Error updating password:', err);
      res.status(500).json({ message: 'Server error' });
    }
  
    }
  };

export const getBookStatus = async (req, res) => {
  const userId = globalUserId; 
  if (!userId) {
    return res.status(400).json({ message: "Buyer ID is required" });
  }
  
  try {
    const requestSql = `
      SELECT bookId, requestDate, status 
      FROM request 
      WHERE userId = ?`;

    const [requestRows] = await db.query(requestSql, [userId]);

    if (requestRows.length === 0) {
      return res.status(404).json({ message: "No requests found for this buyer" });
    }

    const bookIds = requestRows.map((row) => row.bookId);

    const bookSql = `
      SELECT id as bookId, bookName, price 
      FROM books 
      WHERE id IN (?)`;

    const [bookRows] = await db.query(bookSql, [bookIds]);

    const bookMap = {};
    bookRows.forEach((book) => {
      bookMap[book.bookId] = {
        bookName: book.bookName,
        bookPrice: book.price,
      };
    });

    const requests = requestRows.map((row) => ({
      bookId: row.bookId,
      bookName: bookMap[row.bookId]?.bookName || "Unknown", // Check if book exists
      bookPrice: bookMap[row.bookId]?.bookPrice || 0, // Default price to 0 if not found
      date: row.requestDate,
      status: row.status,
    }));

    res.json({ requests });
  } catch (err) {
    console.error("Error fetching request details:", err);
    res.status(500).json({ message: "Server error" });
  }
};
