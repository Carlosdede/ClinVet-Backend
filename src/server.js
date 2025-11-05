import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 10000;

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log("Cliente conectado via Socket.IO:", socket.id);

  socket.on("disconnect", (reason) => {
    console.log("Cliente desconectado:", reason);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor HTTP + WebSocket rodando na porta ${PORT}`);
});
