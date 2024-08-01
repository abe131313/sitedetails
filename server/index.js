// index.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const xml2js = require('xml2js');
const fs = require('fs');
require('dotenv').config();


const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
// console.log(process.env.COMPUTERNAME);
const dbPass = process.env.DB_PASS;
mongoose.connect(`mongodb+srv://yirigaacluster:${dbPass}@yirigaa-cluster.rfa7hy1.mongodb.net/?retryWrites=true&w=majority&appName=yirigaa-cluster`, { useNewUrlParser: true, useUnifiedTopology: true });

// Define a Mongoose schema
const xmlSchema = new mongoose.Schema({}, { strict: false });
const XMLModel = mongoose.model('XMLData', xmlSchema);

// Route to upload and process XML
app.post('/upload-xml', (req, res) => {
    const xmlData = req.body.xmlData;

    xml2js.parseString(xmlData, (err, result) => {
        if (err) {
            return res.status(400).json({ error: 'Failed to parse XML' });
        }

        const xmlDocument = new XMLModel(result);
        xmlDocument.save((err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to save XML data' });
            }
            res.status(200).json({ message: 'XML data saved successfully' });
        });
    });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
