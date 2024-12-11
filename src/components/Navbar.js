import { React, useContext } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";

function Navbar({
  darkMode,           // Boolean to determine current theme mode
  onThemeChange,      // Function to toggle between light and dark modes
  showBackButton,     // Boolean to conditionally render back button
  onBack,             // Function to handle back navigation logic
  logInStatus,        // Boolean to determine if user is logged in
}) {
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Destructure context to access and update login status
  const [ ,setIsLoggedIn ] = useContext(AppContext);

  return (
    // Main App Bar component with default color and static positioning
    <AppBar position="static" color="default">
      <Toolbar
        sx={{
          // Dynamic background and text color based on dark mode
          backgroundColor: darkMode ? "#121212" : "#f5f5f5",
          color: darkMode ? "#fff" : "#000",
          justifyContent: "space-between", // Distribute space evenly
        }}
      >
        {/* Conditionally render back button if showBackButton is true */}
        {showBackButton && (
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => {
              onBack();           // Execute custom back logic
              navigate("/");      // Navigate to home page
            }}
            sx={{ color: darkMode ? "#fff" : "#000" }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}

        {/* App Title */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            // Add left margin if back button is shown
            ml: showBackButton ? 2 : 0,
          }}
        >
          Yirigaa
        </Typography>

        {/* Container for right-side navigation items */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Theme toggle button */}
          <IconButton
            onClick={onThemeChange}
            sx={{ color: darkMode ? "#fff" : "#000" }}
          >
            {/* Conditionally render sun or moon icon based on dark mode */}
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {/* Conditional rendering based on login status */}
          {logInStatus ? (
            // Render logout button when user is logged in
            <Button
              onClick={() => {
                // Logout logic: clear local storage and update login status
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setIsLoggedIn(false);
                navigate("/login");
              }}
              sx={{ ml: 2, color: darkMode ? "#fff" : "#000" }}
            >
              Logout
            </Button>
          ) : (
            // Render login and signup buttons when user is not logged in
            <>
              <Button
                sx={{ ml: 2, color: darkMode ? "#fff" : "#000" }}
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login
              </Button>
              <Button
                onClick={() => navigate("/signUp")}
                sx={{ ml: 2, color: darkMode ? "#fff" : "#000" }}
              >
                Signup
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;