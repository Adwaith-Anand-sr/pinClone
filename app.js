const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
   cors: {
      origin: "http://localhost:3000",
      credentials: true,
   }
});
const path = require("path");
const flash = require("connect-flash");
const { instrument } = require("@socket.io/admin-ui");


const expressSession = require("express-session");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

let mongoPass= "adwaith.6574";
let dbName = "socialMediaApp";
const uri = `mongodb+srv://sreeadwa:${mongoPass}@cluster0.dubqcyd.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(uri).then(()=>{
   console.log("connected to mongodb");
});

const adminUI = instrument(io, {
  auth: {
    type: "basic",
    username: "adwaith@admin",
    password: "$2a$10$YxzVqYNPBS3qYHmXkyJenuyqbgf8Xj5nFYP6KyLpT85OFHz4fRV2q"
  }
});

// Serve static files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use("/admin", adminUI);

app.use(expressSession({
   resave: false, 
   saveUninitialized: false ,
   secret: "hdhdhfhfhydhd"
}));

app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static("./node_modules/@socket.io/admin-ui/ui/dist"));

app.use('/admin-ui', express.static(path.join(__dirname, 'node_modules', '@socket.io', 'admin-ui', 'ui', 'dist')));





module.exports = { app, server, io };