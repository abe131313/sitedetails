// Import necessary React hooks and Material-UI components
import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import CustomizedSnackbar from "./SnackBar";
import axios from "axios";

function SignupPage({ onSignup, darkMode }) {
  // State variables to manage form input and feedback
  const [username, setUsername] = useState(""); // Store username input
  const [password, setPassword] = useState(""); // Store password input
  const [error, setError] = useState(""); // Store error messages (currently commented out)
  const [success, setSuccess] = useState(""); // Store success messages (currently commented out)
  const [open, setOpen] = useState(false); // Control Snackbar visibility
  const [message, setMessage] = useState(""); // Snackbar message
  const [severity, setSeverity] = useState(""); // Snackbar severity level

  // Handler to open the Snackbar
  const handleSnackbarOpen = () => {
    setOpen(true);
  };

  // Handler to close the Snackbar
  const handleSnackbarClose = () => {
    setOpen(false);
  };

  // Async function to handle signup process
  const handleSignup = async () => {
    try {
      // Send POST request to signup endpoint
      await axios.post("http://localhost:5000/signup", {
        username,
        password,
      });
      // Set success message and Snackbar properties on successful signup
      setSuccess("User created successfully. You can now log in.");
      setMessage("Signup successful!");
      setSeverity("success"); // Set Snackbar to success state
    } catch (err) {
      // Handle signup failure
      setSeverity("warning"); // Set Snackbar to warning state
      setMessage("Try another username!"); // Set error message
    }
  };

  return (
    // Outer container with responsive styling and dark/light mode support
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: darkMode ? "#121212" : "#f5f5f5", // Background color based on mode
        color: darkMode ? "#fff" : "#000", // Text color based on mode
      }}
    >
      {/* Inner container for signup form */}
      <Box
        sx={{
          width: { xs: "90%", sm: "400px" }, // Responsive width
          padding: "32px",
          borderRadius: "8px",
          boxShadow: "0px 4px 8px rgba(0,0,0,0.3)",
          backgroundColor: darkMode ? "#343131" : "#fff", // Background color based on mode
        }}
      >
        {/* Logo section */}
        <Box sx={{ marginBottom: "16px" }}>
          <img
            src={require("../yirigaaLogo.png")} // Local logo image
            alt="Logo"
            style={{
              width: "100px",
              height: "auto",
              boxShadow: "0px 4px 8px rgba(0,0,0,0.3)",
              borderRadius: "50px",
            }}
          />
        </Box>

        {/* Signup title */}
        <Typography
          variant="h5"
          textAlign="center"
          mb={3}
          sx={{ fontWeight: "bold" }}
        >
          Sign up
        </Typography>

        {/* Username input field with dark/light mode styling */}
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Update username state
          margin="normal"
          sx={{
            // Custom styling for input field based on dark mode
            "& .MuiOutlinedInput-input": {
              color: darkMode ? "white" : "#000000",
            },
            "& .MuiInputLabel-root": {
              fontWeight: "bold",
              color: darkMode ? "#FEFBF6" : "#000000",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: darkMode ? "transparent" : "transparent",
              boxShadow: "inset 0 0 5px rgba(0, 0, 0, 0.5)",
              font: "white",
            },
          }}
        />

        {/* Password input field with similar styling */}
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state
          margin="normal"
          sx={{
            // Same custom styling as username field
            "& .MuiOutlinedInput-input": {
              color: darkMode ? "white" : "#000000",
            },
            "& .MuiInputLabel-root": {
              fontWeight: "bold",
              color: darkMode ? "#FEFBF6" : "#000000",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: darkMode ? "transparent" : "transparent",
              boxShadow: "inset 0 0 5px rgba(0, 0, 0, 0.5)",
              font: "white",
            },
          }}
        />

        {/* Signup button */}
        <Button
          variant="contained"
          fullWidth
          onClick={() => {
            handleSignup(); // Trigger signup process
            handleSnackbarOpen(); // Open Snackbar
          }}
          style={{
            marginTop: "16px",
            backgroundColor: "#B17457", // Custom button color
            color: "#fff",
          }}
        >
          Signup
        </Button>

        {/* Conditionally render Snackbar if there's a message */}
        {message.length > 0 ? (
          <CustomizedSnackbar
            open={open}
            setOpen={setOpen}
            message={message}
            severity={severity}
          />
        ) : null}
      </Box>
    </Box>
  );
}

export default SignupPage;