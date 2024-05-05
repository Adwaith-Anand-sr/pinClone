var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const multer = require('multer');
const admin = require('firebase-admin')
const path = require("path");
const fs = require('fs');

const userModel = require("../models/users.js");
const postModel = require("../models/posts.js");

require('dotenv').config();
const serviceAccount = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN
};

admin.initializeApp({
 credential: admin.credential.cert(serviceAccount),
 storageBucket: 'gs://social-media-app-000.appspot.com',  
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const bucket = admin.storage().bucket();

router.get('/', isLoggedIn,  function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
   res.render('login');
});

router.get('/register', function(req, res, next) {
   res.render('register');
});

router.get('/logout', function(req, res, next) {
   res.cookie("token", "")
   res.redirect("/login")
});

router.get('/profile', isLoggedIn, async function(req, res, next) {
   let user = await userModel.findOne({username: req.user.username})
   res.render('profile', {user: user});
});

router.get('/upload', isLoggedIn, async function(req, res, next) {
   let user = await userModel.findOne({username: req.user.username})
   res.render('upload', {user});
});

router.get('/posts', isLoggedIn, async function(req, res, next) {
   let user = await userModel.findOne({username: req.user.username})
   res.render('posts', {user});
});

router.post('/register', async function(req, res, next) {
   let {username, fullname, password, gender, email} = req.body
   
   let existUser = await userModel.findOne({username})
   
   if (existUser) {
      return res.status(500).send("username alredy exists!!")
   }
   
   bcrypt.genSalt(10, (err, salt)=>{
      if (err) res.send(err)
      bcrypt.hash(password, salt, async (err, hash)=>{
         if (err) res.send(err)
         let user = await userModel.create({username, fullname, password: hash, gender, email})
      })
   })
   
   let token = jwt.sign({email, username}, "...here the secret")
   res.cookie("token", token)
   res.redirect("/")
});

router.post('/login', async function(req, res, next) {
   let {username, password} = req.body

   let existUser = await userModel.findOne({username})
   if (!existUser) {
      return res.status(500).send("invalid username or password.")
   }
   
   bcrypt.compare(password, existUser.password, (err, result)=>{
      if(result){
         let token = jwt.sign({email: existUser.email, username}, "...here the secret")
         res.cookie("token", token)
         req.flash("user", existUser)
         res.redirect("/profile")
      }else return res.status(500).send("invalid username or password.")
   })
});

router.post('/upload', upload.single('image'), isLoggedIn, async(req, res) => {
   try {
   if (!req.file) {
      return res.status(400)
   }
   const file = req.file;
   const originalname = file.originalname;
   const ext = path.extname(originalname);
   const fileName = Date.now() + ext;
   const fileUpload = bucket.file(fileName);
   await fileUpload.save(file.buffer, {
   metadata: {
      contentType: file.mimetype
   }
   });

   const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
   res.status(200)
   let user = await userModel.findOne({ username: req.user.username })
   let post = await postModel.create({ user: user._id, posts: imageUrl })
   user.posts.push(post._id)
   await user.save()
   res.redirect("/upload")
 } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).send('Error uploading image.');
 }
   
});

function isLoggedIn(req, res, next) {
   if (req.cookies.token) {
      let data = jwt.verify(req.cookies.token, "...here the secret")
      req.user = data
      next();
   } else {
      res.status(401).redirect("/login");
   }
}

module.exports = router;