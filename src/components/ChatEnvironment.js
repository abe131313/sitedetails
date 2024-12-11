import React, { useState, useEffect, useRef } from "react";
import { Box, TextField, Typography, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ChatEnvironment({ searchQuery, darkMode }) {
  // State to hold messages in the chat
  const [messages, setMessages] = useState([]);
  
  // State to hold the current input message
  const [currentMessage, setCurrentMessage] = useState("");
  
  // Ref to track if the initial search query has been added as a message
  const initialMessageAdded = useRef(false);

  const navigate = useNavigate();

  // Add the search query as the first message on component mount
  useEffect(() => {
    if (searchQuery && !initialMessageAdded.current) {
      handleSendMessage(searchQuery, "user"); // Add search query as a user message
      initialMessageAdded.current = true; // Mark as added
    }
  }, [searchQuery]);

  // Function to save a message to the database
  const saveMessageToDB = async (message) => {
    try {
      await axios.post("http://localhost:5000/messages/add", message);
    } catch (error) {
      console.error("Error saving message to DB", error);
    }
  };

  // Function to handle sending a message
  const handleSendMessage = (messageText, sender = "user") => {
    if (!messageText.trim()) return; // Ignore empty messages

    const newMessage = { sender, text: messageText };

    // Update the state to include the new message
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Save the new message to the database
    saveMessageToDB(newMessage);

    if (sender === "user") {
      // Simulate an AI response with a delay
      setTimeout(() => {
        const aiResponse = {
          sender: "ai",
          text: "This is a response from AI (simulated).",
        };

        // Add AI response to the state
        setMessages((prevMessages) => [...prevMessages, aiResponse]);

        // Save the AI response to the database
        saveMessageToDB(aiResponse);
      }, 1000);

      // Clear the input field
      setCurrentMessage("");
    }
  };

  // Handle changes in the input field
  const handleInputChange = (event) => {
    setCurrentMessage(event.target.value);
  };

  // Handle pressing the "Enter" key to send a message
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage(currentMessage);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "90vh",
        overflow: "hidden",
        backgroundColor: darkMode ? "#121212" : "#f5f5f5", // Adjust background for dark mode
      }}
    >
      {/* Message Display Area */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: "8px",
          display: "flex",
          flexDirection: "column",
          maxHeight: "calc(100vh - 64px)", // Ensure messages fit in view
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start", // Align messages
              backgroundColor: msg.sender === "user" ? "#1976d2" : "#e0e0e0", // Different color for user and AI messages
              color: msg.sender === "user" ? "#fff" : "#000",
              padding: "8px 16px",
              borderRadius: "12px",
              marginBottom: "8px",
              maxWidth: "60%",
            }}
          >
            <Typography variant="body1">{msg.text}</Typography>
          </Box>
        ))}
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          display: "flex",
          padding: "8px",
          backgroundColor: darkMode ? "#121212" : "#f5f5f5", // Adjust input background for dark mode
          boxSizing: "border-box",
          flexShrink: 0,
          width: "100%",
        }}
      >
        <TextField
          value={currentMessage}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          variant="outlined"
          fullWidth
          multiline
          minRows={1}
          maxRows={2}
          sx={{
            flex: 1,
            marginRight: "8px",
            "& .MuiInputBase-root": {
              color: darkMode ? "#fff" : "#000", // Input text color
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: darkMode ? "#fff" : "#000", // Border color for dark mode
              },
              "&:hover fieldset": {
                borderColor: darkMode ? "#fff" : "#000",
              },
              "&.Mui-focused fieldset": {
                borderColor: darkMode ? "#fff" : "#000",
              },
            },
            "&::placeholder": {
              color: darkMode ? "#fff" : "#000", // Placeholder text color
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSendMessage(currentMessage)}
          endIcon={<SendIcon />}
          sx={{
            backgroundColor: darkMode ? "#1d1d1d" : "#e0e0e0", // Button background
            color: darkMode ? "#fff" : "#000", // Button text color
            "&:hover": {
              backgroundColor: darkMode ? "#333" : "#ccc", // Hover effect
              color: darkMode ? "#fff" : "#000",
            },
          }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}

export default ChatEnvironment;
