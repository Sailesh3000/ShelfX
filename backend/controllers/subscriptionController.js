import db from "../db.js"; // Adjust this import to match your db file structure

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

export const getSubscriptionByUserId = async (req, res) => {
    const userId = req.params.id;
    try {
        const sql = "SELECT id, userId, plan FROM subscriptions WHERE userId = ?";
        const [rows] = await db.query(sql, [userId]);
        if (rows.length === 0) {
            res.status(404).send("Subscription not found");
        } else {
            res.status(200).json(rows[0]);
        }
    } catch (err) {
        console.error("Error fetching subscription:", err);
        res.status(500).send("Server error");
    }
};
