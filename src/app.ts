
import express, { Application, Request, Response, NextFunction, ErrorRequestHandler } from "express";
import http from "http";
import path from 'path';
import fs from 'fs';
import fileUpload from 'express-fileupload';
import bodyParser from "body-parser";
import cors from "cors";
import { prismaClient } from "./lib/prismaClient";
import router from "./routes/router";
import { openAPIRouter } from "./api-docs/openAPIRouter";
import { ZodError } from "zod";
import { formatZodErrorsDetailed } from "./utils/error-formatter";

const app: Application = express();
const server: http.Server = http.createServer(app);

const UPLOAD_DIR: string = process.env.UPLOAD_DIR || 'uploads';
const PUBLIC_UPLOAD_PATH: string = process.env.PUBLIC_UPLOAD_PATH || '/uploads';
const uploadDirPath: string = path.resolve(__dirname, '..', UPLOAD_DIR);

if (!fs.existsSync(uploadDirPath)) {
  try {
    fs.mkdirSync(uploadDirPath, { recursive: true });
    console.log(`Created upload directory: ${uploadDirPath}`);
  } catch (err) {
    console.error(`FATAL: Failed to create upload directory ${uploadDirPath}:`, err);
    process.exit(1);
  }
}

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
};
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));

app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 },
  createParentPath: true,
  abortOnLimit: true,
}));

app.use(PUBLIC_UPLOAD_PATH, express.static(uploadDirPath));
console.log(`Serving static files from ${uploadDirPath} at ${PUBLIC_UPLOAD_PATH}`);

app.use('/docs', openAPIRouter);

app.use(router);

const globalErrorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error("Global Error Handler Caught:", err.name, "-", err.message);
  if (process.env.NODE_ENV === 'development' && err.stack) {
    console.error(err.stack);
  }

  if (err instanceof ZodError) {
    if (!res.headersSent) {
      res.status(400).json(formatZodErrorsDetailed(err));
    } else {
      console.error("Headers already sent for ZodError, cannot send JSON response.");
    }
    return;
  }

  let statusCode = 500;
  let message = "An unexpected internal server error occurred.";

  if ((err as any).type === 'entity.too.large' || err.message.includes('File size exceeds the limit')) {
    statusCode = 413;
    message = "File size exceeds the limit.";
  }
  else if (err.message) {
    message = err.message;
    if (message.toLowerCase().includes("not found")) {
      statusCode = 404;
    } else if (message.includes("Insufficient stock")) {
      statusCode = 409;
    } else if (message.includes("Invalid") || message.includes("required") || message.includes("must be")) {
      statusCode = 400;
    }
  }

  if (!res.headersSent) {
    res.status(statusCode).json({
      success: false,
      error: {
        message: message,
      }
    });
  } else {
    console.error("Headers already sent, cannot send JSON error response for general error.");
  }
};

app.use(globalErrorHandler);

const shutdown = async (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  try {
    await prismaClient.$disconnect();
    console.log('Prisma client disconnected.');
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  } catch (e) {
    console.error('Error during shutdown:', e);
    process.exit(1);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  shutdown('Uncaught Exception');
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Docs available at http://localhost:${PORT}/docs`);
});