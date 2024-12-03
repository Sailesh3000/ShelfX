import db from "../db.js"; // Adjust this import to match your db file structure
import { sendApprovalEmail } from "./emailService.js";
export const getRequestsBySellerId = async (req, res) => {
    const { sellerId } = req.params;

    try {
        const sql = `
            SELECT 
                r.id,
                r.userId,
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
                r.sellerId = ? AND status = "PENDING";
        `;

        const [rows] = await db.query(sql, [sellerId]);
        res.status(200).json(rows);
    } catch (err) {
        console.error("Error fetching requests:", err);
        res.status(500).send("Server error");
    }
};

export const approveRequest = async (req, res) => {
    const { bookId } = req.params;
  const { sellerId, userId, bookName, buyerEmail } = req.body; 

  try {
    const sql = "UPDATE request SET status = ? WHERE bookId = ? AND sellerId = ? AND userId = ?";
    await db.query(sql, ["APPROVED", bookId, sellerId, userId]);

    await sendApprovalEmail(buyerEmail,bookName);

    res.json({ message: "Request approved successfully, email sent to buyer and seller!" });
  } catch (error) {
    console.error("Error approving request:", error);
    res.status(500).json({ message: "Error approving request", error });
  }
};

export const rejectRequest = async (req, res) => {
    const { bookId } = req.params;
    const { sellerId, userId } = req.body;

    try {
        const sql = "UPDATE request SET status = ? WHERE bookId = ? AND sellerId = ? AND userId = ?";
        await db.query(sql, ["REJECTED", bookId, sellerId, userId]);
        res.json({ message: "Request rejected successfully" });
    } catch (error) {
        console.error("Error rejecting request:", error);
        res.status(500).json({ message: "Error rejecting request", error });
    }
};
