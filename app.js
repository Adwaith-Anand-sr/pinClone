const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require("path");
const flash = require("connect-flash");

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



// Serve static files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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



module.exports = { app, server, io };