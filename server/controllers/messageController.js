// controllers/messagesController.js
const Message = require("../models/messageModel.js");

const addMessage = async (req, res) => {
  const { sender, text } = req.body;

  try {
    const newMessage = await Message.create({ sender, text });
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { addMessage };
