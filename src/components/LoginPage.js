import React, { useState, useContext, useEffect } from "react";
import { Box, TextField, Button } from "@mui/material";
import TypewriterText from "./TypeWritter"; // Custom Typewriter component for animated text
import CustomizedSnackbar from "./SnackBar"; // Snackbar component for showing notifications
import axios from "axios"; // For making HTTP requests
import { useNavigate } from "react-router-dom"; // For navigation
import { AppContext } from "../App"; // Context for managing global application state

function LoginPage({ onLogin, darkMode }) {
  const navigate = useNavigate(); // To navigate to different routes
  const [username, setUsername] = useState(""); // State for username input
  const [password, setPassword] = useState(""); // State for password input
  const [error, setError] = useState(""); // State for handling errors
  const [open, setOpen] = useState(false); // State for Snackbar visibility
  const [message, setMessage] = useState(""); // State for Snackbar message
  const [severity, setSeverity] = useState(""); // State for Snackbar severity (e.g., success, warning)

  const [isLoggedIn, setIsLoggedIn] = useContext(AppContext); // Context for global login state

  // Handles the login logic when the "Login" button is clicked
  const handleLogin = async () => {
    try {
      // Send POST request to login endpoint
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });
      setMessage("login successful!"); // Display success message
      setSeverity("success");
      setOpen(true); // Open Snackbar
      navigate("/loggedInChat"); // Redirect to chat page
      
      // Extract user and token from response
      const { user, token } = response.data;
      localStorage.setItem("user", user.username); // Store username in localStorage
      localStorage.setItem("token", token); // Store token in localStorage
      setIsLoggedIn(true); // Update global login state

      // Uncomment the following line if onLogin is passed for additional actions
      // onLogin(user);
    } catch (err) {
      setError("Invalid username or password"); // Update error state
      setMessage("login unsuccessful, Please try again with correct details"); // Display error message
      setSeverity("warning"); // Set Snackbar severity to warning
      setOpen(true); // Open Snackbar
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        backgroundColor: darkMode ? "#121212" : "#f5f5f5", // Adjust background for dark/light mode
        color: darkMode ? "#fff" : "#000",
      }}
    >
      <Box
        sx={{
          width: { xs: "90%", sm: "400px" },
          padding: "32px",
          borderRadius: "8px",
          boxShadow: "0px 4px 8px rgba(0,0,0,0.3)", // Box shadow for card effect
          backgroundColor: darkMode ? "#343131" : "#fff",
        }}
      >
        {/* Animated text with Typewriter effect */}
        <TypewriterText
          text="Login to have a personalised experience."
          speed={50} // Typing speed in milliseconds
          delay={500} // Optional delay before starting to type
          variant="h5" // Typography variant
        />
        {/* Username input field */}
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Update username state
          margin="normal"
          sx={{
            "& .MuiOutlinedInput-input": {
              color: darkMode ? "white" : "#000000", // Input text color
            },
            "& .MuiInputLabel-root": {
              fontWeight: "bold",
              color: darkMode ? "#D8D2C2" : "#000000", // Label color
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: darkMode ? "transparent" : "transparent",
                boxShadow: "inset 0 0 5px rgba(0, 0, 0, 0.5)", // Inner shadow effect
              },
          }}
        />
        {/* Password input field */}
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state
          margin="normal"
          sx={{
            "& .MuiOutlinedInput-input": {
              color: darkMode ? "white" : "#000000", // Input text color
            },
            "& .MuiInputLabel-root": {
              fontWeight: "bold",
              color: darkMode ? "#D8D2C2" : "#000000", // Label color
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: darkMode ? "transparent" : "transparent",
                boxShadow: "inset 0 0 5px rgba(0, 0, 0, 0.5)", // Inner shadow effect
              },
          }}
        />
        {/* Login button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin} // Trigger login on click
          sx={{
            marginTop: "16px",
            backgroundColor: darkMode ? "#1d1d1d" : "#e0e0e0", // Adjust button background
            color: darkMode ? "#fff" : "#000",
            "&:hover": {
              backgroundColor: darkMode ? "#333" : "#ccc", // Button hover effect
              color: darkMode ? "#fff" : "#000",
            },
          }}
        >
          Login
        </Button>
        {/* Snackbar for notifications */}
        {message.length > 0 ? (
          <CustomizedSnackbar
            open={open}
            setOpen={setOpen}
            message={message} // Snackbar message
            severity={severity} // Snackbar severity
          />
        ) : null}
      </Box>
    </Box>
  );
}

export default LoginPage;
