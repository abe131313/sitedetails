import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, TextField, Typography, IconButton, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { AppContext } from "../App";

function LoggedInChatInterface({ searchQuery, darkMode }) {
  // State to hold chat messages
  const [messages, setMessages] = useState([]);
  // State for the current message input
  const [currentMessage, setCurrentMessage] = useState("");
  // Ref to ensure the search query is added as a message only once
  const initialMessageAdded = useRef(false);

  const navigate = useNavigate();
  const userId = localStorage.getItem("user"); // Retrieve the logged-in user's ID from localStorage
  // Context variables from AppContext
  const [isLoggedIn, setIsLoggedIn, handleThemeChange, showChat, handleBack] = useContext(AppContext);

  // Add the initial search query as the first message
  useEffect(() => {
    if (searchQuery && !initialMessageAdded.current) {
      handleSendMessage(searchQuery, userId);
      initialMessageAdded.current = true; // Mark the initial message as added
    }
  }, [searchQuery]);

  // Fetch the chat history for the logged-in user from the database
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/messages/${userId}`
        );
        setMessages(response.data); // Populate messages state with fetched data
      } catch (error) {
        console.error("Error fetching chat history", error); // Log errors
      }
    };

    if (userId) {
      fetchChatHistory();
    }
  }, [userId]);

  // Save a message to the database
  const saveMessageToDB = async (message) => {
    console.log(message); // Log message for debugging
    try {
      await axios.post("http://localhost:5000/messages/login-add", message); // Save message to DB
    } catch (error) {
      console.error("Error saving message to DB", error); // Log errors
    }
  };

  // Function to handle sending a message
  const handleSendMessage = (messageText, sender = userId) => {
    if (!messageText.trim()) return; // Ignore empty messages

    const newMessage = { sender, text: messageText }; // Construct a new message object

    // Add the message to the local state
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Save the message to the database
    saveMessageToDB({ ...newMessage, userId });

    if (sender === userId) {
      // Simulate an AI response after a delay
      setTimeout(() => {
        const aiResponse = {
          sender: "ai",
          text: "This is a response from AI (simulated).",
        };
        setMessages((prevMessages) => [...prevMessages, aiResponse]); // Add AI response to state

        // Save the AI response to the database
        console.log({ ...aiResponse, responseToUser: userId }); // Log AI response
        saveMessageToDB({ ...aiResponse, responseToUser: userId });
      }, 1000);

      setCurrentMessage(""); // Clear the input field
    }
  };

  // Update the state when the input field changes
  const handleInputChange = (event) => {
    setCurrentMessage(event.target.value);
  };

  // Handle sending a message when the Enter key is pressed
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      handleSendMessage(currentMessage); // Send message on Enter key press
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: darkMode ? "#121212" : "#f5f5f5", // Adjust background color based on dark mode
      }}
    >
      {/* Navigation bar with theme and back button functionality */}
      <Navbar
        darkMode={darkMode}
        onThemeChange={handleThemeChange}
        onBack={handleBack}
        logInStatus={isLoggedIn}
      />

      {/* Message Display Area */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: "8px",
          display: "flex",
          flexDirection: "column",
          maxHeight: "calc(100vh - 64px)", // Fit messages without scrolling
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              alignSelf: msg.sender === userId ? "flex-end" : "flex-start", // Align based on sender
              backgroundColor: msg.sender === userId ? "#1976d2" : "#e0e0e0", // Different background colors for user and AI
              color: msg.sender === userId ? "#fff" : "#000", // Text color based on sender
              padding: "8px 16px",
              borderRadius: "12px",
              marginBottom: "8px",
              maxWidth: "60%", // Limit message width
            }}
          >
            <Typography variant="body1">{msg.text}</Typography>
          </Box>
        ))}
      </Box>

      {/* Input Field and Send Button Area */}
      <Box
        sx={{
          display: "flex",
          padding: "8px",
          backgroundColor: darkMode ? "#121212" : "#f5f5f5", // Adjust input area background color
          boxSizing: "border-box",
          flexShrink: 0,
          width: "100%",
        }}
      >
        <TextField
          value={currentMessage} // Bind input value to state
          onChange={handleInputChange} // Update state on input change
          onKeyPress={handleKeyPress} // Send message on Enter key press
          placeholder="Type your message..." // Placeholder text
          variant="outlined"
          fullWidth
          multiline
          minRows={1}
          maxRows={2}
          sx={{
            flex: 1,
            marginRight: "8px",
            "& .MuiInputBase-root": {
              color: darkMode ? "#fff" : "#000", // Input text color based on dark mode
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: darkMode ? "#fff" : "#000", // Border color based on dark mode
              },
              "&:hover fieldset": {
                borderColor: darkMode ? "#fff" : "#000",
              },
              "&.Mui-focused fieldset": {
                borderColor: darkMode ? "#fff" : "#000",
              },
            },
            "&::placeholder": {
              color: darkMode ? "#fff" : "#000", // Placeholder text color based on dark mode
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSendMessage(currentMessage)} // Send message on button click
          endIcon={<SendIcon />}
          sx={{
            backgroundColor: darkMode ? "#1d1d1d" : "#e0e0e0", // Button background color
            color: darkMode ? "#fff" : "#000", // Button text color
            "&:hover": {
              backgroundColor: darkMode ? "#333" : "#ccc", // Hover effect for button
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

export default LoggedInChatInterface;
