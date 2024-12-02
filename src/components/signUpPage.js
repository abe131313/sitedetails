import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import CustomizedSnackbar from "./SnackBar";
import axios from "axios";

function SignupPage({ onSignup, darkMode }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");

  const handleSnackbarOpen = () => {
    setOpen(true);
  };

  const handleSnackbarClose = () => {
    setOpen(false);
  };

  const handleSignup = async () => {
    try {
      await axios.post("http://localhost:5000/signup", {
        username,
        password,
      });
      setSuccess("User created successfully. You can now log in.");
      //   setError("");
      setMessage("Signup successful!");
      setSeverity("success"); // Set the message for the Snackbar
    } catch (err) {
      //   setError("User creation failed. Try a different username.");
      setSeverity("warning"); // Set the severity for the Snackbar
      setMessage("Try another username!"); // Set the message for the Snackbar
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: darkMode ? "#121212" : "#f5f5f5",
        color: darkMode ? "#fff" : "#000",
      }}
    >
      <Box
        sx={{
          width: { xs: "90%", sm: "400px" },
          padding: "32px",
          borderRadius: "8px",
          boxShadow: "0px 4px 8px rgba(0,0,0,0.3)",
          backgroundColor: darkMode ? "#343131" : "#fff",
        }}
      >
        {/* Logo Image */}
        <Box sx={{ marginBottom: "16px" }}>
          <img
            src={require("../yirigaaLogo.png")} // Path to the image, assuming it is in the public folder
            alt="Logo"
            style={{
              width: "100px",
              height: "auto",
              boxShadow: "0px 4px 8px rgba(0,0,0,0.3)",
              borderRadius: "50px",
            }}
          />
        </Box>
        <Typography
          variant="h5"
          textAlign="center"
          mb={3}
          sx={{ fontWeight: "bold" }}
        >
          Sign up
        </Typography>
        {/* {error && (
          <Typography color="error" textAlign="center">
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="success.main" textAlign="center">
            {success}
          </Typography>
        )} */}
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
              color: darkMode ? "#FEFBF6" : "#000000",
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
              // Styles for the label
              fontWeight: "bold",
              color: darkMode ? "#FEFBF6" : "#000000",
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
        <Button
          variant="contained"
          fullWidth
          onClick={() => {
            handleSignup();
            handleSnackbarOpen();
          }}
          style={{
            marginTop: "16px",
            backgroundColor: "#B17457",
            color: "#fff",
          }}
        >
          Signup
        </Button>
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
