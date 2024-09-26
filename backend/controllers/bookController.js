import db from "../db.js"; // Adjust this import to match your db file structure

export const booksCount = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT COUNT(*) as count FROM books");
        res.json({ count: rows[0].count });
    } catch (err) {
        console.error("Error fetching book count:", err);
        res.status(500).send("Server error");
    }
};
