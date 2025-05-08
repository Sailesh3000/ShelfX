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
import redisClient, { cacheMiddleware } from "./config/redis.js";
import db from "./db.config.js";
import { initializeSocket } from './socket.js';

const app = express();
const port = 5000;
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(
  cors({
    origin:"https://shelfx-app.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.set('trust proxy', 1); 

app.use(cookieParser());
app.use(express.json());
app.use(fileUpload({ useTempFiles: true, tempFileDir: "./tmp/" })); 
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));

// Apply cache middleware to API routes before router
// Default cache duration is 1 hour (3600 seconds)
// app.use(cacheMiddleware());

// Enhanced session store configuration
const MySQLStore = expressMySQL(session);

const sessionStore = new MySQLStore({}, db);

app.use(
  session({
    key: process.env.SESSION_KEY || "session_cookie_name",
    secret: process.env.SESSION_SECRET || "asdg34NJSQKK78",
    store: sessionStore,
    resave: true,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/'
    }
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
      url: 'https://shelfx-backend.onrender.com',
      description: 'Development server',
    },
  ],
};

// Swagger options
const options = {
  swaggerDefinition,
  apis: ['./backend/swagger.js'], // Path to the API docs
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

// Serve swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Apply routes after cache middleware
app.use(router);
app.use(notFound); 
app.use(errorHandler);

// Export the db connection for use in other files
export default db;

// Connect to Redis and start the server
const startServer = async () => {
  try {
    // Connect to Redis
    await redisClient.connect();
    
    // Create HTTP server
    const server = app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
      console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
      console.log('Redis caching enabled');
    });

    // Initialize Socket.IO
    initializeSocket(server);
    console.log('Socket.IO server initialized');
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    // Start server even if Redis fails
    const server = app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
      console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
      console.log('Warning: Redis caching disabled');
    });

    // Initialize Socket.IO even if Redis fails
    initializeSocket(server);
    console.log('Socket.IO server initialized');
  }
};

// Only start the server if we're not in a test environment
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

// Export the app for testing
export { app };