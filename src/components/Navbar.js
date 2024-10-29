import React from "react";
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

function Navbar({ darkMode, onThemeChange, showBackButton, onBack }) {
  return (
    <AppBar position="static" color="default">
      <Toolbar
        sx={{
          backgroundColor: darkMode ? "#121212" : "#f5f5f5",
          color: darkMode ? "#fff" : "#000",
          justifyContent: "space-between",
        }}
      >
        {/* Back Button */}
        {showBackButton && (
          <IconButton
            edge="start"
            color="inherit"
            onClick={onBack}
            sx={{ color: darkMode ? "#fff" : "#000" }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}

        {/* Title on the left */}
        <Typography variant="h5" sx={{ fontWeight: "bold", ml: showBackButton ? 2 : 0 }}>
          Yirigaa
        </Typography>

        {/* Login/Signup options on the right */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Theme Toggle */}
          <IconButton
            onClick={onThemeChange}
            sx={{ color: darkMode ? "#fff" : "#000" }}
          >
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {/* Login and Signup buttons */}
          <Button sx={{ ml: 2, color: darkMode ? "#fff" : "#000" }}>
            Login
          </Button>
          <Button sx={{ ml: 2, color: darkMode ? "#fff" : "#000" }}>
            Signup
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
