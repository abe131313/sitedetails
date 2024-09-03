const express = require('express');
const router = express() // created an express router

const scrapeRouter = require('./scrapeRouter'); //referencing the file scrapeRouter.js in the routes file

router.use('/scrape',scrapeRouter); // using the route /scrape to direct requests to scrapeRouter.js file

module.exports = router;