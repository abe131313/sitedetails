import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  useTheme,
  CssBaseline,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import TypewriterText from "./TypeWritter";
import axios from "axios";

function LoginPage({ onLogin, darkMode }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        username,
        password,
      });
      // Assuming the backend returns a user object and a token
      const { user, token } = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      onLogin(user);
    } catch (err) {
      setError("Invalid username or password");
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
        backgroundColor: darkMode ? "#121212" : "#f5f5f5",
        color: darkMode ? "#fff" : "#000",
      }}
    >
      {/* <Box
        component="img"
        src="C:\Users\abrar\OneDrive\Pictures\Screenshots\Screenshot 2024-09-04 114636.png" // Replace with your image URL
        alt="Login Image"
        sx={{
          width: "100%",
          maxWidth: "150px",
          display: "block",
          margin: "0 auto 16px", // Center the image and add bottom margin
        }}
      /> */}
      <Box
        sx={{
          width: { xs: "90%", sm: "400px" },
          padding: "32px",
          borderRadius: "8px",
          boxShadow: "0px 4px 8px rgba(0,0,0,0.3)",
          backgroundColor: darkMode ? "#343131" : "#fff",
        }}
      >
        {/* <Typography
          variant="h5"
          textAlign="center"
          mb={3}
          sx={{ fontWeight: "bold" }}
        >
          Welcome, login to 
        </Typography> */}
        <TypewriterText
          text="Login to have a personalised experience."
          // blinkText={true}
          speed={50} // Typing speed in milliseconds
          delay={500} // Optional delay before starting to type
          variant="h5" // Optional: change typography variant
          // color="primary" // Optional: change text color
        />
        {error && (
          <Typography color="error" textAlign="center">
            {error}
          </Typography>
        )}
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
          sx={{
            "& .MuiOutlinedInput-input": {
              // Target the input element
              color: darkMode ? "white" : "#000000", // Set color to white
            },
            "& .MuiInputLabel-root": {
              // Styles for the label
              fontWeight: "bold",
              color: darkMode ? "#D8D2C2" : "#000000",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                // Styles for focused border
                borderColor: darkMode ? "transparent" : "transparent",
                boxShadow: "inset 0 0 5px rgba(0, 0, 0, 0.5)", // Inner shadow effect
                font: "white",
              },
          }}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          sx={{
            "& .MuiOutlinedInput-input": {
              // Target the input element
              color: darkMode ? "white" : "#000000", // Set color to white
            },
            "& .MuiInputLabel-root": {
              fontWeight: "bold",
              color: darkMode ? "#D8D2C2" : "#000000",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                // Styles for focused border
                borderColor: darkMode ? "transparent" : "transparent",
                boxShadow: "inset 0 0 5px rgba(0, 0, 0, 0.5)", // Inner shadow effect
              },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          sx={{
            marginTop: "16px",
            backgroundColor: darkMode ? "#1d1d1d" : "#e0e0e0",
            color: darkMode ? "#fff" : "#000",
            "&:hover": {
              backgroundColor: darkMode ? "#333" : "#ccc",
              color: darkMode ? "#fff" : "#000",
            },
          }}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
}

export default LoginPage;
