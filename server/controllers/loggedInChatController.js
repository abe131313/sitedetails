// controllers/loggedInChatController.js
const Message = require("../models/messageModel.js");
const userCredential = require("../models/userSchema.js");

const addMessages = async (req, res) => {
  const { sender, text, responseToUser } = req.body;

  try {
    // const user = await Message.findOne({ sender: sender });
    const newMessage = await Message.create({ sender: sender, text: text, responseToUser: responseToUser });
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

const getMessages = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await Message.findOne({ sender: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const messages = await Message.find({ sender: userId });
    const messages2 = await Message.find({ responseToUser: userId });
    
    // Combine messages and sort by timestamp
    const completeChatData = [...messages, ...messages2].sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );

    res.status(200).json(completeChatData);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { addMessages, getMessages };
