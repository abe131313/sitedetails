import "./App.css";
import React, {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
} from "react";
import SearchBar from "./components/SearchBar";
import ChatEnvironment from "./components/ChatEnvironment";
import LoggedInChatInterface from "./components/LoggedInChatInterface.js";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage.js";
import SignupPage from "./components/signUpPage.js";
import Navbar from "./components/Navbar.js";

export const AppContext = createContext();

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // State to track dark/light mode
  const chatRef = useRef(null); // Reference to the ChatEnvironment for scrolling
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setShowChat(true); // Show ChatEnvironment on search
  };

  const handleBack = () => {
    setShowChat(false); // Go back to the SearchBar component
  };

  const handleThemeChange = () => {
    setDarkMode(!darkMode); // Toggle between light and dark mode
  };

  // Scroll to the ChatEnvironment smoothly
  useEffect(() => {
    if (showChat && chatRef.current) {
      setTimeout(() => {
        chatRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200); // Adding a delay of 200ms to ensure the component is rendered
    }
  }, [showChat]);

  // Light and Dark Themes
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#90caf9" : "#1976d2",
      },
      background: {
        default: darkMode ? "#121212" : "#fafafa",
        paper: darkMode ? "#1d1d1d" : "#fff",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <AppContext.Provider value={[isLoggedIn, setIsLoggedIn, handleThemeChange, showChat, handleBack]}>        
        <CssBaseline /> {/* Apply global styles for light/dark mode */}
        <Router>
          <div className="App" style={{ height: "100vh" }}>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Navbar
                      darkMode={darkMode}
                      onThemeChange={handleThemeChange}
                      showBackButton={showChat}
                      onBack={handleBack}
                      logInStatus={isLoggedIn}
                    />
                    <SearchBar
                      onSearch={handleSearch}
                      darkMode={darkMode}
                      onThemeChange={handleThemeChange}
                    />
                  </>
                }
              />
              <Route
                path="/chat"
                element={
                  <>
                    <Navbar
                      darkMode={darkMode}
                      onThemeChange={handleThemeChange}
                      showBackButton={showChat}
                      onBack={handleBack}
                    />
                    <ChatEnvironment
                      searchQuery={searchQuery}
                      darkMode={darkMode}
                      onThemeChange={handleThemeChange}
                    />
                  </>
                }
              />
              <Route
                path="/signUp" // Note that the path is all lowercase.
                element={<SignupPage darkMode={darkMode} />}
              />
              <Route
                path="/login" // Note that the path is all lowercase.
                element={<LoginPage darkMode={darkMode} />}
              />
              <Route
                path="/loggedInChat" // Note that the path is all lowercase.
                element={<LoggedInChatInterface darkMode={darkMode} />}
              />
            </Routes>
          </div>
        </Router>
      </AppContext.Provider>
    </ThemeProvider>
  );
}

export default App;
