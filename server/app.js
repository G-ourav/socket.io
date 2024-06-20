import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
// import jwt from "jsonwebtoken";
// import cookieParser from "cookie-parser";
// const secretKeyJWT = "asdasdsadasdasdasdsa";
const port = 3001;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// app.get("/login", (req, res) => {
//   const token = jwt.sign({ _id: "asdasjdhkasdasdas" }, secretKeyJWT);

//   res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" }).json({
//     message: "Login Success",
//   });
// });

// io.use((socket, next) => {
//   cookieParser()(socket.request, socket.request.res, (err) => {
//     if (err) return next(err);

//     const token = socket.request.cookies.token;
//     if (!token) return next(new Error("Authentication Error"));

//     const decoded = jwt.verify(token, secretKeyJWT);
//     next();
//   });
// });
let online_users = [];

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);
  // chat with single
  socket.on("online", ({ token }) => {
    online_users.push({ socket_id: socket.id, token: token });
    console.log(online_users, token);
  });

  socket.on("message", ({ room, message }) => {
    console.log({ room, message });
    socket.to(room).emit("receive-message", message);
    socket.emit("messagea", { id: socket.id });
  });

  socket.on("join-room", ({ room, token }) => {
    socket.join(room);
    online_users.push({ socket_id: socket.id, token: token });
    console.log(` User joined room ${room}`, online_users, token);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
