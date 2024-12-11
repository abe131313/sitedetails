// models/messageModel.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  userId: {type: Number, required: false},
  sender: { type: String, required: true },
  text: { type: String, required: true },
  responseToUser:{type:String, required:false},
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
