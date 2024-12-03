import bcrypt from "bcrypt";
import db from "../db.js"; // Adjust this import to match your db file structure

let globalUserId = null;

export const signupSeller = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        await db.query(sql, [username, email, hashedPassword]);
        res.status(200).send("Registration successful");
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).send("Server error");
    }
};

export const loginSeller = async (req, res) => {
    const { email, password } = req.body;
    try {
        const sql = "SELECT id, email, password FROM users WHERE email = ?";
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
        console.error("Error logging in:", err);
        res.status(500).send("Server error");
    }
};

export const getDetails = async (req, res) => {
    const userId = globalUserId;
    if (!userId) return res.status(401).json({ message: "User not authenticated" });

    try {
        const sqlUser = "SELECT * FROM users WHERE id = ?";
        const [rowsUser] = await db.query(sqlUser, [userId]);
        if (rowsUser.length === 0) return res.status(404).json({ message: "User not found" });

        const user = rowsUser[0];
        const sqlBooks = "SELECT id, bookname, address, pincode, price, imageData FROM books WHERE userId = ?";
        const [rowsBooks] = await db.query(sqlBooks, [userId]);

        const books = rowsBooks.map(book => ({
            address: book.address,
            pincode: book.pincode,
            price: book.price,
            id: book.id,
            bookName: book.bookname,
            imageUrl: book.imageData ? `data:image/jpeg;base64,${book.imageData.toString("base64")}` : null,
        }));

        res.json({ user, books });
    } catch (err) {
        console.error("Error fetching current user:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getSellers = async (req, res) => {
    try {
        const sql = "SELECT id, username, email FROM users";
        const [rows] = await db.query(sql);
        res.status(200).json(rows);
    } catch (err) {
        console.error("Error fetching sellers:", err);
        res.status(500).send("Server error");
    }
};

export const getCountSellers = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT COUNT(*) as count FROM users");
        res.json({ count: rows[0].count });
    } catch (err) {
        console.error("Error fetching seller count:", err);
        res.status(500).send("Server error");
    }
};

export const getSellerDetailsById = async (req, res) => {
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
};

export const updateSellerDetailsById = async (req, res) => {
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
};

export const deleteSellerById = async (req, res) => {
    const { id } = req.params;

    try {
        const sql = "DELETE FROM users WHERE id = ?";
        await db.query(sql, [id]);
        res.status(200).send("Seller deleted successfully");
    } catch (err) {
        console.error("Error deleting seller:", err);
        res.status(500).send("Server error");
    }
};

export const uploadBook = async (req, res) => {
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
};

export const deleteBook = async(req, res) => {
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
    }


    export const subscribePlan = async (req, res) => {
        const { selectedPlan } = req.params;
        const userId = globalUserId;
    
        if (!userId) {
            return res.status(401).send("User not authenticated");
        }
    
        try {
            const [rows] = await db.query(
                "SELECT * FROM subscriptions WHERE userId = ?",
                [userId]
            );
    
            if (rows.length > 0) {
                const updateSql = "UPDATE subscriptions SET plan = ? WHERE userId = ?";
                await db.query(updateSql, [selectedPlan, userId]);
                res.status(200).send("Subscription updated successfully");
            } else {
                const insertSql = "INSERT INTO subscriptions (userId, plan) VALUES (?, ?)";
                await db.query(insertSql, [userId, selectedPlan]);
                res.status(200).send("Subscription successful");
            }
        } catch (err) {
            console.error("Error subscribing user:", err);
            res.status(500).send("Server error");
        }
    };
    


export const editUserProfile = async (req, res) => {
    const userId = globalUserId; 
    const { username,newpassword } = req.body; 
  
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
  if(newpassword==null){
    try {
      const sql = 'UPDATE users SET username = ? WHERE id = ?';
      const [result] = await db.query(sql, [username, userId]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ message: 'Username updated successfully' });
    } catch (err) {
      console.error('Error updating username:', err);
      res.status(500).json({ message: 'Server error' });
    }}
  else{
    try {
      const hashedPassword = await bcrypt.hash(newpassword, 10);
      const sql = 'UPDATE users SET password = ? WHERE id = ?';
      const [result] = await db.query(sql, [hashedPassword, userId]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ message: 'password updated successfully' });
    } catch (err) {
      console.error('Error updating password:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
  
  };

export const logout = (req, res) => {
    req.session.destroy();
    res.status(200).send("Logout successful");
};
