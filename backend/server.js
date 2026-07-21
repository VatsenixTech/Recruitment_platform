import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import { connectDatabase } from "./config/database.js";
import demoRoutes from "./routes/demoRoutes.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/errorHandler.js";

// Get the current backend directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load backend/.env
const envPath = path.join(__dirname, ".env");

const envResult = dotenv.config({
  path: envPath,
});

if (envResult.error) {
  console.error(`Could not load environment file: ${envPath}`);
  console.error(envResult.error.message);
} else {
  console.log(`Environment file loaded from: ${envPath}`);
}

const app = express();
const port = Number(process.env.PORT) || 5000;
const frontendUrl =
  process.env.FRONTEND_URL || "http://localhost:5173";

app.set("trust proxy", 1);

app.use(helmet());

app.use(
  cors({
    origin: frontendUrl,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

const publicFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many requests were submitted. Please wait and try again later.",
  },
});

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to the NoPromptJobs backend.",
  });
});

app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "NoPromptJobs API is running.",
    databaseConfigured: Boolean(process.env.MONGODB_URI),
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/demo-requests", publicFormLimiter, demoRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  try {
    console.log("Starting NoPromptJobs backend...");
    console.log(`Frontend URL: ${frontendUrl}`);

    if (!process.env.MONGODB_URI) {
      throw new Error(
        `MONGODB_URI is missing. Create this file: ${envPath}`
      );
    }

    await connectDatabase();

    app.listen(port, () => {
      console.log("======================================");
      console.log(`NoPromptJobs backend is running.`);
      console.log(`API URL: http://localhost:${port}`);
      console.log(`Health check: http://localhost:${port}/api/health`);
      console.log("======================================");
    });
  } catch (error) {
    console.error("Server startup failed:");
    console.error(error.message);

    process.exit(1);
  }
}

startServer();