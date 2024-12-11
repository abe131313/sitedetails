import React, { useState, useEffect, useCallback } from "react";
import {
  TextField,
  InputAdornment,
  Box,
  IconButton,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Slide,
  Grow,
  keyframes,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import axios from "axios";
import debounce from "lodash/debounce";
import Particles from "react-tsparticles";
import { loadFireflyPreset } from "tsparticles-preset-firefly";
import { useNavigate } from "react-router-dom";

function SearchBar({ onSearch, darkMode }) {
  // State to manage the search query input
  const [searchQuery, setSearchQuery] = useState("");
  // State to store search suggestions
  const [suggestions, setSuggestions] = useState([]);
  // State to track the active tab
  const [tabIndex, setTabIndex] = useState(0);
  // State to track focus state of the search bar
  const [isFocused, setIsFocused] = useState(false);

  const navigate = useNavigate();

  // Debounce the fetchSuggestions function to limit API calls
  const debouncedFetchSuggestions = useCallback(
    debounce(async (query) => {
      if (query.length < 2) {
        // If the query length is less than 2, reset suggestions
        setSuggestions([]);
        return;
      }

      try {
        // Fetch suggestions from the server
        const response = await axios.get(`http://localhost:5000/suggest`, {
          params: { query },
        });
        console.log("Fetched suggestions:", response.data);
        setSuggestions(response.data); // Update state with the fetched suggestions
      } catch (error) {
        console.error("Error fetching suggestions", error); // Log any error
      }
    }, 500), // Debounce interval
    []
  );

  // Handle input changes and trigger the debounced API call
  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query); // Update the search query state
    debouncedFetchSuggestions(query); // Fetch suggestions for the current query
  };

  const handleFocus = () => setIsFocused(true); // Handle input focus
  const handleBlur = () => setIsFocused(false); // Handle input blur

  // Add a suggestion to the search input and clear the list
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion); // Set the clicked suggestion as the search query
    setSuggestions([]); // Clear suggestions
    onSearch(suggestion); // Trigger the search
  };

  // Handle Enter key press for search
  const handleKeyPress = async (event) => {
    if (event.key === "Enter") {
      onSearch(searchQuery); // Perform the search
      setSuggestions([]); // Clear suggestions
      try {
        // Send the search query to the server for logging
        await axios.post(`http://localhost:5000/search`, {
          query: searchQuery,
        });
      } catch (error) {
        console.error("Error saving the search", error);
      }
    }
  };

  // Handle tab change
  const handleTabChange = (event, newIndex) => setTabIndex(newIndex);

  // Styled Paper component for the tab content
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    ...(darkMode && {
      backgroundColor: "#1A2027", // Adjust background color for dark mode
      color: "#fff",
    }),
  }));

  // Initialize the particles effect with the Firefly preset
  const particlesInit = async (main) => await loadFireflyPreset(main);

  // Options for the Firefly particle effect
  const particlesOptions = {
    preset: "firefly",
    background: {
      color: darkMode ? "#000000" : "#ffffff", // Match background with dark mode
    },
  };

  // Define a simple keyframes animation for the search button
  const slideAnimation = keyframes`
    0%, 100% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(5px);
    }
  `;

  return (
    <Box sx={{ position: "relative", overflow: "hidden" }}>
      {/* Firefly Background Effect */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1, // Place behind the main content
        }}
      />
      <Box
        sx={{
          width: { xs: "90%", sm: "70%", md: "50%" },
          height: "85vh",
          padding: "16px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center", // Center align the content
        }}
      >
        {/* Search Bar Section */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "750px",
            marginBottom: "16px",
            position: "relative",
          }}
        >
          <TextField
            value={searchQuery}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      onSearch(searchQuery); // Trigger search on click
                      navigate("/chat"); // Navigate to chat page
                    }}
                  >
                    <ArrowForwardIcon
                      sx={{
                        color: darkMode ? "white" : "black",
                        animation: isFocused
                          ? `${slideAnimation} 1s ease-in-out infinite`
                          : "none", // Apply animation on focus
                      }}
                    />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                height: "35px",
                padding: "0",
                backgroundColor: darkMode ? "#1E201E" : "#D6DAC8",
              },
            }}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "transparent" },
                "&:hover fieldset": { borderColor: "transparent" },
                "&.Mui-focused fieldset": { borderColor: "transparent" },
              },
            }}
          />

          {/* Suggestions List */}
          {suggestions.length > 0 && (
            <Grow
              in={suggestions.length > 0}
              style={{ transformOrigin: "top" }}
              mountOnEnter
              unmountOnExit
              timeout={500}
            >
              <List
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: "100%",
                  bgcolor: darkMode
                    ? "rgba(26, 32, 39, 0.6)"
                    : "rgba(255, 255, 255, 0.6)",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  borderRadius: "4px",
                  zIndex: 10,
                  backdropFilter: "blur(5px)", // Frosted glass effect
                }}
              >
                {suggestions.map((suggestion, index) => (
                  <ListItem
                    button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    sx={{
                      bgcolor: darkMode
                        ? "rgba(26, 32, 39, 0.8)"
                        : "rgba(255, 255, 255, 0.8)",
                      margin: "1px 0",
                      borderRadius: "10px",
                    }}
                  >
                    <ListItemText primary={suggestion} />
                  </ListItem>
                ))}
              </List>
            </Grow>
          )}
        </Box>

        {/* Tabs Section */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "750px",
            marginBottom: "16px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="primary"
            sx={{
              backgroundColor: darkMode ? "rgba(26, 32, 39, 0.6)" : "#e0e0e0",
              borderRadius: "8px",
            }}
          >
            <Tab label="Tab 1" />
            <Tab label="Tab 2" />
            <Tab label="Tab 3" />
          </Tabs>
        </Box>

        {/* Tab Content Section */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "750px",
            padding: "20px",
            backgroundColor: darkMode ? "#1A2027" : "#fff",
            color: darkMode ? "#fff" : "#000",
            borderRadius: "8px",
          }}
        >
          {tabIndex === 0 && <Typography>This is some content for Tab 1.</Typography>}
          {tabIndex === 1 && <Typography>This is content for Tab 2.</Typography>}
          {tabIndex === 2 && <Typography>Here is the content for Tab 3.</Typography>}
        </Box>
      </Box>
    </Box>
  );
}

export default SearchBar;
