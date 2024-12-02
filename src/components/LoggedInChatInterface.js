import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  Paper, 
  IconButton, 
  InputBase, 
  Divider, 
  ThemeProvider, 
  createTheme, 
  CssBaseline 
} from '@mui/material';
import { 
  Send as SendIcon, 
  Search as SearchIcon 
} from '@mui/icons-material';

const ChatInterface = (darkMode = false) => {
  // State management
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      name: 'John Doe',
      lastMessage: 'Hey, how are you?',
      avatar: '/path/to/avatar1.jpg'
    },
    {
      id: 2,
      name: 'Jane Smith',
      lastMessage: 'Meeting at 2 PM',
      avatar: '/path/to/avatar2.jpg'
    }
  ]);

  // Theme creation
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    }
  });

  // Message sending handler
  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([
        ...messages, 
        { 
          id: messages.length + 1, 
          text: inputMessage, 
          sender: 'me' 
        }
      ]);
      setInputMessage('');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{ 
          display: 'flex', 
          height: '100vh', 
          border: '1px solid', 
          borderColor: 'divider' 
        }}
      >
        {/* Chat History Panel */}
        <Box 
          sx={{ 
            width: '300px', 
            borderRight: '1px solid', 
            borderColor: 'divider', 
            overflowY: 'auto' 
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              p: 2, 
              fontWeight: 'bold' 
            }}
          >
            Chats
          </Typography>
          <List>
            {chatHistory.map((chat) => (
              <ListItem key={chat.id} button>
                <ListItemAvatar>
                  <Avatar src={chat.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={chat.name}
                  secondary={chat.lastMessage}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Chat Area */}
        <Box 
          sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column' 
          }}
        >
          {/* Messages Display Area */}
          <Box 
            sx={{ 
              flexGrow: 1, 
              overflowY: 'auto', 
              p: 2 
            }}
          >
            {messages.map((msg) => (
              <Box 
                key={msg.id} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start',
                  mb: 2 
                }}
              >
                <Paper 
                  sx={{ 
                    p: 1.5, 
                    maxWidth: '60%', 
                    backgroundColor: msg.sender === 'me' 
                      ? (darkMode ? '#2e7d32' : '#e8f5e9') 
                      : (darkMode ? '#1565c0' : '#e3f2fd') 
                  }}
                >
                  <Typography variant="body2">
                    {msg.text}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Box>

          {/* Message Input Area */}
          <Box 
            sx={{ 
              p: 2, 
              borderTop: '1px solid', 
              borderColor: 'divider' 
            }}
          >
            <Paper
              component="form"
              sx={{ 
                p: '2px 4px', 
                display: 'flex', 
                alignItems: 'center', 
                width: '100%' 
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Type a message"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <IconButton 
                color="primary" 
                sx={{ p: '10px' }} 
                onClick={handleSendMessage}
              >
                <SendIcon />
              </IconButton>
            </Paper>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ChatInterface;