// Importing necessary libraries and modules
const fs = require("fs"); // File system module to interact with the file system
const axios = require("axios"); // Library for making HTTP requests
const dataScrapModel = require('../models/dataScrapModel.js');
require("dotenv").config();
const path = require('path');

// testing without intermediate save

async function scrapeData(url) {
  try {
    let result = await axios.post(
      "https://api.scraptio.com/scrape",
      {
        url: url,
        api_key: `${process.env.SCRAPTIO_APIKEY}`, // API key for authentication
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 8000, // Set a request timeout of 8 seconds
      }
    );

    if (result.status === 402) {
      console.error("Insufficient credits to perform the scrape.");
      throw new Error("Insufficient credits to perform the scrape.");
    }

    return result.data;

  } catch (error) {
    console.error(`Error in the API for scraping website ${url}: ${error.message}`);
    throw error; // No retries, fail immediately
  }
}

// Function to build the nested structure in memory
async function createNestedStructure(urls, initialLoc) {
  let urlWithoutTrailingSlash = initialLoc.replace(/\/$/, ""); // Remove trailing slash

  const root = {
    url: urlWithoutTrailingSlash,
    location: urlWithoutTrailingSlash,
    children: [],
  };

  for (let url of urls) {
    const pathParts = url.replace(initialLoc, "").split("/").filter(Boolean);
    let currentLevel = root;

    for (let partIndex in pathParts) {
      let part = pathParts[partIndex];
      let fullUrl = `${initialLoc}/${pathParts.slice(0, parseInt(partIndex) + 1).join('/')}`;

      let existingNode = currentLevel.children.find(child => child.url === part);

      if (!existingNode) {
        console.log(`Creating node for: ${fullUrl}`);

        let scrapedData;
        try {
          scrapedData = await scrapeData(fullUrl); // Fetch data
        } catch (error) {
          scrapedData = "Error occurred while scraping"; // Handle scraping error
        }

        existingNode = {
          url: part,
          location: fullUrl,
          data: scrapedData,
          children: [],
        };

        currentLevel.children.push(existingNode);
      }
      currentLevel = existingNode;
    }
  }

  return root; // Return the root object containing the full nested structure
}

// Crawl website function to explore URLs and build the nested structure

async function crawlWebsite(req, res) {
  let failed_to_fetch_count = 0;
  let failedUrls = [];

  const { url: startUrl } = req.body;
  if (!startUrl) {
    return res.status(400).send("URL query parameter is required");
  }

  const baseUrl = new URL(startUrl).origin;
  const visitedUrls = new Set();
  const urlQueue = [startUrl];
  const urls = [];

  // Define the directory path where you want to save the file
  const directoryPath = 'D:/React apps/sitedetails'; // Change this to your desired directory path

  // Make sure the directory exists, and if not, create it
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true }); // Create the directory if it doesn't exist
  }

  // Create a full file path with the directory and filename
  const fileName = path.join(directoryPath, `crawled_data_${Date.now()}.json`);

  while (urlQueue.length > 0) {
    const currentUrl = urlQueue.shift();
    if (visitedUrls.has(currentUrl)) continue;

    try {
      // Log each URL being visited
      console.log(`Visiting: ${currentUrl}`);

      // HTTP request with 8 seconds timeout, no retries
      const response = await axios.get(currentUrl, { timeout: 8000 });

      visitedUrls.add(currentUrl);
      urls.push(currentUrl);

      // Extract all anchor links from the page using regex
      const linkMatches = response.data.match(/href="(\/[^"]+|https?:\/\/[^"]+)"/g);
      if (linkMatches) {
        linkMatches.forEach(linkMatch => {
          const link = linkMatch.match(/href="([^"]+)"/)[1];
          const absoluteLink = new URL(link, currentUrl).href;

          if (absoluteLink.startsWith(baseUrl) && !visitedUrls.has(absoluteLink)) {
            urlQueue.push(absoluteLink);
          }
        });
      }
    } catch (error) {
      console.error(`Failed to fetch ${currentUrl}: ${error.message}`);
      failed_to_fetch_count++;
      failedUrls.push({ url: currentUrl, error: error.message });
    }
  }

  console.log("Crawling complete");

  // Create the nested structure in memory
  const nestedStructure = await createNestedStructure(urls, startUrl);
  
  // Write the entire nested structure to a file at once
  fs.writeFile(fileName, JSON.stringify(nestedStructure, null, 2), (err) => {
    if (err) {
      console.error(`Failed to save the data to file: ${err.message}`);
      return res.status(500).json({ message: 'Error saving data to file', error: err.message });
    }

    console.log(`Data saved to file: ${fileName}`);
  });

  // Send response with the nested structure and failed URLs
  res.json({
    message: 'Crawling complete',
    nestedStructure,
    failed_to_fetch_count,
    failedUrls,
  });
}






// Export the functions for use in other modules
module.exports = {
  crawlWebsite, // Function to crawl the website and create a nested structure
}
