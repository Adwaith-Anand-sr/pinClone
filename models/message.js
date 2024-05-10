const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
   sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true 
   },
   receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true 
   },
   message: {
      type: String,
      required: true 
   },
   timestamp: {
      type: Date,
      default: Date.now
   }
});

module.exports  = mongoose.model('message', messageSchema);