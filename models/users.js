const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
   username: {
      type: String,
      required: true,
      unique: true
   },
   fullname: String,
   password: String,
   email: String,
   gender: String,
   createdAt: {
      type: Date,
      default: Date.now
   },
   followers: {
      type: Number,
      default: 0
   },
   followings: {
      type: Number,
      default: 0
   },
   posts: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "post"
      }
   ],
   verified: Boolean,
   dp: String,
   cover: String
})

module.exports = mongoose.model('user', userSchema)
