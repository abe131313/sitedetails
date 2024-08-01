const fs = require('fs');
const xml2js = require('xml2js');

// Handle XML upload
exports.uploadXML = (req, res) => {
    const xmlData = req.body.xmlData;

    xml2js.parseString(xmlData, (err, result) => {
        if (err) {
            return res.status(400).json({ error: 'Failed to parse XML' });
        }

        // Process the parsed data as needed
        console.log(result);

        // Respond with success
        res.status(200).json({ message: 'XML data processed successfully', data: result });
    });
};

// Handle processing of XML file
exports.processXMLFile = (req, res) => {
    fs.readFile('sample.xml', 'utf8', (err, xmlData) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read XML file' });
        }

        xml2js.parseString(xmlData, (err, result) => {
            if (err) {
                return res.status(400).json({ error: 'Failed to parse XML' });
            }

            // Process the parsed data as needed
            console.log(result);

            // Respond with success
            res.status(200).json({ message: 'XML file processed successfully', data: result });
        });
    });
};
