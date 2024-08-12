const express = require('express');
const router = express()

const xmlRoutes = require('./xmlRoutes');

router.use('/xml',xmlRoutes);

module.exports = router;