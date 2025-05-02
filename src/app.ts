import express from "express";
import http from "http";
import { PrismaClient } from "@prisma/client";
import { Server } from "socket.io";
import router from "./routes/router";
import { openAPIRouter } from "./api-docs/openAPIRouter";
const app = express();
const server = http.createServer(app);
const prisma = new PrismaClient();
app.use('/docs', openAPIRouter)

app.use(router)

// Prisma graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start Server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});