import express from "express";
import path from "path";
import mysql from "mysql2/promise";
import fileUpload from "express-fileupload";
import cors from "cors";
import bodyParser from "body-parser";
import session from "express-session";
import multer from "multer";
import router from "./routes/routes.js";
import cookieParser from "cookie-parser";
import {errorHandler} from "./middleware/errorMiddleware.js";
import {notFound} from "./middleware/notfoundMiddleware.js";
import morgan from "morgan";
import expressMySQL from "express-mysql-session";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const app = express();
const port = 5000;
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(
  cors({
    origin:"http://localhost:5174",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(fileUpload({ useTempFiles: true, tempFileDir: "./tmp/" })); 
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));

const MySQLStore = expressMySQL(session);
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "ShelfX"
});

app.use(
  session({
    key: "session_cookie_name",
    secret: "asdg34NJSQKK78",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: 'lax' // Important for cross-origin requests
    },
  })
);
app.use(express.static(path.join(process.cwd(), "build")));

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'ShelfX Database API Documentation',
    version: '1.0.0',
    description: 'API documentation for the ShelfX book rental platform database services',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development server',
    },
  ],
};

// Swagger options
const options = {
  swaggerDefinition,
  apis: ['../swagger.js'], // Path to the API docs - relative to backend directory
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

// Serve swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use(router);
app.use(notFound); 
app.use(errorHandler);



// Import database connection from config file
import db from "./db.config.js";

// Export the db connection for use in other files
export default db;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});