import React, { useState, useEffect, useRef } from "react";
import { Box, TextField, Typography, IconButton, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ChatEnvironment({ searchQuery, darkMode }) {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const initialMessageAdded = useRef(false);

  const navigate = useNavigate();

  // On initial render, add the search query as the first message from the user
  useEffect(() => {
    if (searchQuery && !initialMessageAdded.current) {
      handleSendMessage(searchQuery, "user");
      initialMessageAdded.current = true; // Mark that the initial message has been added
    }
  }, [searchQuery]);

  const saveMessageToDB = async (message) => {
    try {
      await axios.post("http://localhost:5000/messages/add", message);
    } catch (error) {
      console.error("Error saving message to DB", error);
    }
  };

  const handleSendMessage = (messageText, sender = "user") => {
    if (!messageText.trim()) return;

    const newMessage = { sender, text: messageText };

    // Add the message from the user
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender, text: messageText },
    ]);

    saveMessageToDB(newMessage);

    if (sender === "user") {
      // Simulate an AI response after a short delay
      setTimeout(() => {
        const aiResponse = {
          sender: "ai",
          text: "This is a response from AI (simulated).",
        };
        setMessages((prevMessages) => [...prevMessages, aiResponse]);

        // Save the AI response to the database
        saveMessageToDB(aiResponse);
      }, 1000);

      setCurrentMessage(""); // Clear input field if it's a user message
    }
  };

  const handleInputChange = (event) => {
    setCurrentMessage(event.target.value);
  };

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
        backgroundColor: darkMode ? "#121212" : "#f5f5f5",
      }}
    >
      {/* Message Area */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: "8px",
          display: "flex",
          flexDirection: "column",
          maxHeight: "calc(100vh - 64px)", // Adjusting to fit without scrolling
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#1976d2" : "#e0e0e0",
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
          backgroundColor: darkMode ? "#121212" : "#f5f5f5",
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
              color: darkMode ? "#fff" : "#000", // Changes input text color
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: darkMode ? "#fff" : "#000",
              },
              "&:hover fieldset": {
                borderColor: darkMode ? "#fff" : "#000",
              },
              "&.Mui-focused fieldset": {
                borderColor: darkMode ? "#fff" : "#000",
              },
            },
            "&::placeholder": {
              color: darkMode ? "#fff" : "#000",
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSendMessage(currentMessage)}
          endIcon={<SendIcon />}
          sx={{
            backgroundColor: darkMode ? "#1d1d1d" : "#e0e0e0",
            color: darkMode ? "#fff" : "#000",
            "&:hover": {
              backgroundColor: darkMode ? "#333" : "#ccc",
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
