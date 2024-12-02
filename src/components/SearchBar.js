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
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const navigate = useNavigate();

  // Create a debounced function using useCallback so it remains stable between renders
  const debouncedFetchSuggestions = useCallback(
    debounce(async (query) => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/suggest`, {
          params: { query },
        });
        console.log("in fetchSuggestions functions try block");
        console.log(response.data);
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching suggestions", error);
      }
    }, 500), // Adjust debounce time as necessary
    []
  );

  // Handle text input changes
  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    debouncedFetchSuggestions(query);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Handle clicking on a suggestion
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
    onSearch(suggestion);
  };

  // Handle pressing the Enter key
  const handleKeyPress = async (event) => {
    if (event.key === "Enter") {
      onSearch(searchQuery);
      console.log("handleKeyPress function executed");
      setSuggestions([]); // Clear suggestions after search
      try {
        await axios.post(`http://localhost:5000/search`, {
          query: searchQuery,
        });
      } catch (error) {
        console.error("Problem saving the suggestions", error);
      }
    }
  };

  // Handle tab change
  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    ...(darkMode && {
      backgroundColor: "#1A2027",
      color: "#fff",
    }),
  }));

  // Load particles with the Firefly preset
  const particlesInit = async (main) => {
    await loadFireflyPreset(main);
  };

  const particlesOptions = {
    preset: "firefly",
    background: {
      color: darkMode ? "#000000" : "#ffffff",
    },
  };

  // Define the keyframes animation
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
      {/* Firefly Background */}
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
          zIndex: -1,
        }}
      />
      <Box
        sx={{
          width: { xs: "90%", sm: "70%", md: "50%" },
          height: "85vh",
          padding: "16px",
          boxSizing: "border-box",
          position: "relative",
          left: "0",
          marginLeft: "0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center", // Align everything to the center
        }}
      >
        {/* Search Bar Section */}
        <Box
          sx={{
            width: "100%", // Make sure the search bar matches the parent's width
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
                      onSearch(searchQuery);
                      navigate("/chat");
                    }}
                  >
                    <ArrowForwardIcon
                      sx={{
                        color: darkMode ? "white" : "black",
                        animation: isFocused
                          ? `${slideAnimation} 1s ease-in-out infinite`
                          : "none",
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
                "& fieldset": {
                  borderColor: "transparent", // Default border color
                },
                "&:hover fieldset": {
                  borderColor: "transparent", // Border color on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "transparent", // Border color when focused
                },
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
                    : "rgba(255, 255, 255, 0.6)", // Slightly transparent background
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  borderRadius: "4px",
                  zIndex: 10,
                  backdropFilter: "blur(5px)", // Frosted glass effect
                  WebkitBackdropFilter: "blur(10px)", // Frosted glass effect for Safari
                  border: "0px solid rgba(255, 255, 255, 0.2)", // Light border to enhance effect
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
                        : "rgba(255, 255, 255, 0.8)", // Background for list items
                      margin: "1px 0", // Spacing between items
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
              backgroundColor: darkMode ? "#rgba(26, 32, 39, 0.6)" : "#e0e0e0",
              color: darkMode ? "#fff" : "#000",
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
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {tabIndex === 0 && (
            <Typography variant="body1">
              This is some content for Tab 1. You can add any text or elements
              you want here.
            </Typography>
          )}
          {tabIndex === 1 && (
            <Typography variant="body1">
              This is content for Tab 2. You can customize this with any
              information you'd like to display.
            </Typography>
          )}
          {tabIndex === 2 && (
            <Typography variant="body1">
              Here is the content for Tab 3. Feel free to modify this to suit
              your needs.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default SearchBar;
