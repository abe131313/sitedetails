const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  term: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const SearchHistory = mongoose.model('SearchHistory', searchHistorySchema);

module.exports = SearchHistory;
