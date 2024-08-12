const express = require('express');
const router = express.Router();
const xmlController = require('../controllers/xmlcontroller');

// Define routes
router.post('/upload', xmlController.uploadXML);
// router.get('/process-file', xmlController.processXMLFile);
router.get('/testCrawl', xmlController.crawlWebsite);

module.exports = router;
