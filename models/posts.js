const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
   },
   createdAt: {
      type: Date,
      default: Date.now
   },
   posts: String
})

module.exports = mongoose.model('post', postSchema)
