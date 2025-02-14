import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import mysql from "mysql2/promise";
import cors from "cors";
import bodyParser from "body-parser";
import session from "express-session";
import multer from "multer";
import router from "./routes/routes.js";
// Add this import
import MySQLStore from "express-mysql-session";

const app = express();
const port = 5000;

// Initialize MySQL Store
const MySQLStoreSession = MySQLStore(session);
const sessionStore = new MySQLStoreSession({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    createDatabaseTable: true
});

let globalUserId = null;
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(
    cors({
        origin: "https://shelf-x.vercel.app",
        credentials: true,
    })
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    session({
        secret: "asdg34NJSQKK78",
        resave: false,
        saveUninitialized: false,
        store: sessionStore,  // Use the MySQL store
        cookie: {
            expires: 24 * 60 * 60 * 1000,
            sameSite: "None",
            secure: false,
        },
    })
);

app.use(express.static(path.join(process.cwd(), "build")));
app.use((req, res, next) => {
    console.log("Session data:", req.session);
    next();
});

app.use(router);

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
});

export default db;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});