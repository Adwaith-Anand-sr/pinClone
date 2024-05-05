var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });


const userModel = require("../models/users.js");
const firebase = require("../config//firebaseConfig.js");



router.get('/', isLoggedIn,  function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/upload', isLoggedIn,  function(req, res, next) {
   res.render('upload');
});

router.post('/upload', upload.single('image'), async(req, res) => {
   try {
      const file = req.file;
      const fileRef = storage.ref().child(file.originalname);
      await fileRef.put(file.buffer);
      const downloadURL = await fileRef.getDownloadURL();
      res.status(200).json({ downloadURL });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to upload image.' });
   }
   
});

router.get('/profile', isLoggedIn, async function(req, res, next) {
   let user = await userModel.findOne({username: req.user.username})
   res.render('profile', {user: user});
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