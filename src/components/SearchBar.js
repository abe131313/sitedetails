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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import axios from "axios";
import debounce from "lodash/debounce";

function SearchBar({ onSearch, darkMode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);

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

  return (
    <Box
      sx={{
        width: { xs: "90%", sm: "70%", md: "50%" },
        padding: "16px",
        boxSizing: "border-box",
        position: "relative",
        left: "0",
        marginLeft: "0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // Align everything to the center
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
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          InputProps={{
            startAdornment: (
              <InputAdornment>
                <SearchIcon
                  sx={{
                    fontSize: "2rem",
                  }}
                />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment>
                <IconButton onClick={() => onSearch(searchQuery)}>
                  <ArrowForwardIcon
                    sx={{
                      color: darkMode ? "white" : "black",
                    }}
                  />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              height: "35px",
              padding: "0",
            },
          }}
          fullWidth // Makes the text field match the parent box width
        />

        {/* Suggestions List */}
        {suggestions.length > 0 && (
          <List
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              width: "100%",
              bgcolor: darkMode ? "#1A2027" : "#fff",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "4px",
              zIndex: 10,
            }}
          >
            {suggestions.map((suggestion, index) => (
              <ListItem
                button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <ListItemText primary={suggestion} />
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Centered Grid Section */}
      <Grid
        container
        spacing={2}
        maxWidth="750px"
        sx={{ marginBottom: "32px" }}
      >
        <Grid item xs={12} sm={6}>
          <Item>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Item>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Item>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat.
          </Item>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Item>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur.
          </Item>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Item>
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum.
          </Item>
        </Grid>
      </Grid>

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
            backgroundColor: darkMode ? "#333" : "#e0e0e0",
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
            This is some content for Tab 1. You can add any text or elements you
            want here.
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
            Here is the content for Tab 3. Feel free to modify this to suit your
            needs.
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default SearchBar;
