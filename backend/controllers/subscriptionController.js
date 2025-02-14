import db from "../index.js"; // Adjust this import to match your db file structure

export const getSubscriptions = async (req, res) => {
    try {
        const sql = "SELECT id, userId, plan FROM subscriptions";
        const [rows] = await db.query(sql);
        res.status(200).json(rows);
    } catch (err) {
        console.error("Error fetching sellers:", err);
        res.status(500).send("Server error");
    }
};
