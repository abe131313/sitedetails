const SearchHistory = require("../models/searchHistoryModel.js");

const getSearchSuggestions = async (req, res) => {
  try {
    // Fetch the last 5 search queries
    const suggestions = await SearchHistory.find()
      .sort({ timestamp: -1 }) // Sort by latest
      .limit(5); // Limit to 5

    res.json(suggestions.map((s) => s.term));
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

const searchQuery = async (req, res) => {
  const { query } = req.body;

  try {
    // Save the search query to the database
    await SearchHistory.create({ term: query });

    // Limit the total number of records to the latest 5
    const totalRecords = await SearchHistory.countDocuments();
    if (totalRecords > 5) {
      const oldestRecord = await SearchHistory.find()
        .sort({ timestamp: 1 })
        .limit(1);
      await SearchHistory.deleteOne({ _id: oldestRecord[0]._id });
    }

    res.json({ message: "Search successful" });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Export the functions
module.exports = {
  getSearchSuggestions,
  searchQuery,
};
