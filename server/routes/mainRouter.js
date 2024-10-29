const express = require('express');
const router = express.Router(); // Use express.Router() to create the router

const scrapeRouter = require('./scrapeRouter'); // referencing the scrapeRouter.js file
const { getSearchSuggestions, searchQuery } = require('../controllers/searchHistory.js'); // Destructure the functions

router.use('/scrape', scrapeRouter);
router.get('/suggest', getSearchSuggestions); // Get search suggestions
router.post('/search', searchQuery); // Save a search term

module.exports = router;
