const { createServer } = require("http");
const { Server } = require("socket.io");
const express = require("express");
const httpServer = createServer();
const socket = new Server(httpServer, {
   cors: {
      origin: "http://localhost:3000"
   }
});
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
let users = []

const app = express()


socket.on("connection", (socket) => {
   console.log("userconnected");
   socket.on("join", ()=>{
      
   })
});

httpServer.listen(4000, () => {
   console.log("Server is running on port 4000");
});
