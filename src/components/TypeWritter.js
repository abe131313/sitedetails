import React, { useState, useEffect } from 'react';
import { Typography, styled, keyframes } from '@mui/material';

// Create keyframe animations for blinking
const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

// Styled components for blinking effects
const BlinkingText = styled('span')(({ theme }) => ({
  animation: `${blink} 2s infinite`,
}));

const BlinkingCursor = styled('span')(({ theme }) => ({
  display: 'inline-block',
  marginLeft: '2px',
  animation: `${blink} 0.7s infinite`,
}));

const TypewriterText = ({ 
  text, 
  speed = 50, 
  delay = 0, 
  variant = 'body1', 
  color = 'text.primary',
  blinkText = false // New prop to control text blinking
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Reset state when text changes
    setDisplayedText('');
    setIsComplete(false);

    // If text is empty, do nothing
    if (!text) return;

    // Create a timeout to start the typing effect after the initial delay
    const startTyping = setTimeout(() => {
      let currentIndex = 0;
      
      const typingInterval = setInterval(() => {
        // Add one character at a time
        setDisplayedText((prev) => text.slice(0, currentIndex + 1));
        currentIndex++;

        // Stop when we've typed the full text
        if (currentIndex === text.length) {
          clearInterval(typingInterval);
          setIsComplete(true);
        }
      }, speed);

      // Clean up interval on component unmount or text change
      return () => {
        clearInterval(typingInterval);
        clearTimeout(startTyping);
      };
    }, delay);

  }, [text, speed, delay]);

  // Render text with optional blinking
  const renderText = () => {
    if (blinkText && isComplete) {
      return (
        <BlinkingText>
          {displayedText}
          {!isComplete && <BlinkingCursor>|</BlinkingCursor>}
        </BlinkingText>
      );
    }
    
    return (
      <>
        {displayedText}
        {!isComplete && <BlinkingCursor>|</BlinkingCursor>}
      </>
    );
  };

  return (
    <Typography variant={variant} color={color}>
      {renderText()}
    </Typography>
  );
};

export default TypewriterText;