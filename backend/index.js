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
import MySQLStore from "express-mysql-session";

const app = express();
const port = process.env.PORT || 5000;

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
        store: sessionStore,
        cookie: {
            expires: 24 * 60 * 60 * 1000,
            sameSite: "None",
            secure: process.env.NODE_ENV === 'production',
        },
    })
);

app.use(express.static(path.join(process.cwd(), "build")));
app.use((req, res, next) => {
    console.log("Session data:", req.session);
    next();
});

export const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
});

app.use(router);

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

export default app;