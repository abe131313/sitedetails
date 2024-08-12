const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const xmlDataSchema = new Schema({},{strict:false});

const xmlDataModel = mongoose.model('xmlDataModel', xmlDataSchema);

module.exports = xmlDataModel;

