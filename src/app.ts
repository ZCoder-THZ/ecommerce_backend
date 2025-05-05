import express from "express";
import http from "http";
import { prismaClient } from "./lib/prismaClient";
import { Server } from "socket.io";
import router from "./routes/router";
import { openAPIRouter } from "./api-docs/openAPIRouter";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true, // if you need to allow cookies/credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] // allowed methods
};

// ✅ Use CORS middleware before other middleware
app.use(cors(corsOptions));

// ✅ Use body-parser
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/docs', openAPIRouter);
app.use(router);



// Prisma graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await prismaClient.$disconnect();
  process.exit(0);
});

// Start Server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
