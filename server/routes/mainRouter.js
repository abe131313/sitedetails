const express = require('express');
const router = express.Router(); // Use express.Router() to create the router

const scrapeRouter = require('./scrapeRouter'); // referencing the scrapeRouter.js file
const { getSearchSuggestions, searchQuery } = require('../controllers/searchHistory.js'); // Destructure the functions
const {addMessage} = require('../controllers/messageController.js')
const {signUp} = require('../controllers/signUpController.js')

router.use('/scrape', scrapeRouter);
router.get('/suggest', getSearchSuggestions); // Get search suggestions
router.post('/search', searchQuery); // Save a search term
router.post('/messages/add', addMessage); // save chat history to the DB
router.post('/signup', signUp);

module.exports = router;
