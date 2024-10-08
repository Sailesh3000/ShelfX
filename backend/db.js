import express from "express";
import path from "path";
import mysql from "mysql2/promise";
import cors from "cors";
import bodyParser from "body-parser";
import session from "express-session";
import multer from "multer";
import router from "./routes/routes.js"; 

const app = express();
const port = 5000;

let globalUserId = null;

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(
  cors({
    origin: "http://localhost:5173",
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
  host: "localhost",
  user: "root",
  password: "",
  database: "ShelfX",
});

export default db;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
