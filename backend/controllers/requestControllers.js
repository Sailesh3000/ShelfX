import db from "../db.js"; // Adjust this import to match your db file structure
import { sendApprovalEmail } from "./emailService.js";
import { addToHistory } from "./historyController.js";

export const getRequestsBySellerId = async (req, res) => {
    const { sellerId } = req.params;
    console.log('Received request for sellerId:', sellerId);
    console.log('Session:', req.session);
    console.log('Headers:', req.headers);

    try {
        // First check if seller exists
        const [sellerCheck] = await db.query(
            "SELECT id FROM users WHERE id = ?",
            [sellerId]
        );

        if (sellerCheck.length === 0) {
            console.log('Seller not found:', sellerId);
            return res.status(404).json({ 
                message: 'Seller not found',
                sellerId: sellerId
            });
        }

        const sql = `
            SELECT 
                r.id as requestId,
                r.userId,
                r.bookId,
                b.id as buyerId,
                b.pincode,
                b.state,
                b.email as email,
                bk.id as bookId,
                bk.bookName,
                s.id as sellerId,
                r.status
            FROM 
                request r
            JOIN 
                buyers b ON r.userId = b.id
            JOIN 
                books bk ON r.bookId = bk.id
            JOIN 
                users s ON r.sellerId = s.id
            WHERE 
                r.sellerId = ? AND r.status = "PENDING";
        `;

        console.log('Executing SQL query with sellerId:', sellerId);
        const [rows] = await db.query(sql, [sellerId]);
        console.log('Query results:', rows);
        
        if (!rows || rows.length === 0) {
            console.log('No pending requests found for sellerId:', sellerId);
            return res.status(200).json([]); // Return empty array instead of 404
        }
        
        // Log the first row to verify the structure
        if (rows.length > 0) {
            console.log('First row structure:', Object.keys(rows[0]));
        }
        
        res.status(200).json(rows);
    } catch (err) {
        console.error("Error fetching requests:", err);
        console.error("Error details:", {
            message: err.message,
            code: err.code,
            sqlMessage: err.sqlMessage
        });
        res.status(500).json({ 
            message: "Server error",
            error: err.message
        });
    }
};

export const approveRequest = async (req, res) => {
    const { bookId, sellerId, userId, bookName, buyerEmail } = req.body;

    try {
        // Update request status to APPROVED
        const [requestResult] = await db.query(
            "UPDATE request SET status = 'APPROVED' WHERE bookId = ? AND sellerId = ? AND userId = ?",
            [bookId, sellerId, userId]
        );

        if (requestResult.affectedRows === 0) {
            return res.status(404).json({ message: "Request not found" });
        }

        // Get book price and details
        const [bookRows] = await db.query(
            "SELECT price, bookName FROM books WHERE id = ?",
            [bookId]
        );

        if (bookRows.length === 0) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Add to history
        const [historyResult] = await db.query(
            `INSERT INTO history (bookId, sellerId, buyerId, bookName, price, status, requestDate) 
             VALUES (?, ?, ?, ?, ?, 'APPROVED', CURRENT_TIMESTAMP)`,
            [bookId, sellerId, userId, bookRows[0].bookName, bookRows[0].price]
        );

        if (historyResult.affectedRows === 0) {
            return res.status(500).json({ message: "Failed to add to history" });
        }

        // Mark book as SOLD and store the approved buyer's ID
        const [bookUpdateResult] = await db.query(
            "UPDATE books SET status = 'SOLD', approvedBuyerId = ? WHERE id = ?",
            [userId, bookId]
        );

        if (bookUpdateResult.affectedRows === 0) {
            return res.status(500).json({ message: "Failed to update book status" });
        }

        // Send approval email
        const emailSent = await sendApprovalEmail(buyerEmail, bookName);
        if (!emailSent) {
            console.error("Failed to send approval email");
        }

        res.json({ 
            message: "Request approved successfully",
            history: {
                bookId,
                sellerId,
                buyerId: userId,
                bookName: bookRows[0].bookName,
                price: bookRows[0].price,
                status: 'APPROVED'
            }
        });
    } catch (error) {
        console.error("Error approving request:", error);
        res.status(500).json({ 
            message: "Error approving request",
            error: error.message 
        });
    }
};

export const rejectRequest = async (req, res) => {
    const { bookId } = req.params;
    const { sellerId, userId } = req.body;

    try {
        const sql = "UPDATE request SET status = ? WHERE bookId = ? AND sellerId = ? AND userId = ?";
        const [result] = await db.query(sql, ["REJECTED", bookId, sellerId, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.json({ message: "Request rejected successfully" });
    } catch (error) {
        console.error("Error rejecting request:", error);
        res.status(500).json({ message: "Error rejecting request", error });
    }
};

export const getRequestCount = async (req, res) => {
    try {
        const [result] = await db.query('SELECT COUNT(*) as count FROM request');
        res.json(result[0]);
    } catch (error) {
        console.error("Error getting request count:", error);
        res.status(500).send("Server error");
    }
};