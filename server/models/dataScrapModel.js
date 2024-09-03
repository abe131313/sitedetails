// Importing the mongoose library to interact with MongoDB
const mongoose = require('mongoose');

// Destructuring Schema from mongoose to define a new schema for the model
const Schema = mongoose.Schema;

// Creating a new schema for XML data
// An empty object is passed as the first argument, indicating no predefined structure
// The { strict: false } option allows flexibility in the schema, meaning that any data can be stored without validation against a predefined structure
const scrapedDataSchema = new Schema({}, { strict: false });

// Creating a model based on the schema
// The model is named 'scrapedDataModel', and it uses the scrapedDataSchema for its structure
// This model will be used to interact with the 'scrapedDataModel' collection in MongoDB
const scrapedDataModel = mongoose.model('scrapedDataModel', scrapedDataSchema);

// Exporting the model so it can be used in other parts of the application
module.exports = scrapedDataModel;
