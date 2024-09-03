// Import required modules
const express = require('express');
const router = express.Router();
const webScrapper = require('../controllers/webScrapper'); // Controller containing the logic for handling scrapping related requests
const auth = require('../middleware/auth'); // Middleware for handling authentication

// Define the POST route for crawling a website
// The route '/nestedStructure' will trigger the nestedStructure Website method in the webScrapper controller
// The auth middleware is used to ensure that the user is authenticated before accessing this route
router.post('/nestedStructure', auth, webScrapper.crawlWebsite);

// Export the router to be used in the main app
module.exports = router;