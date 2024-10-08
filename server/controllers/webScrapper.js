// Importing necessary libraries and modules
const fs = require("fs"); // File system module to interact with the file system
const xml2js = require("xml2js"); // Library to convert XML to JavaScript objects
const puppeteer = require("puppeteer"); // Library for headless browser automation
const cheerio = require("cheerio"); // Library for server-side jQuery-like HTML manipulation
const axios = require("axios"); // Library for making HTTP requests
const { PuppeteerCrawler, Dataset } = require('crawlee'); // Crawlee modules for web scraping
const { parse } = require('node-html-parser'); // Library to parse HTML content into a DOM structure
const dataScrapModel = require('../models/dataScrapModel.js');
require("dotenv").config();

// Function to scrape the textual data of a website using an external API
async function scrapeData(url) {
  try {
    let result = await axios.post(
      "https://api.scraptio.com/scrape",
      {
        url: url, // URL to scrape
        api_key: `${process.env.SCRAPTIO_APIKEY}`, // API key for authentication
      },
      {
        headers: {
          "Content-Type": "application/json", // Setting the content type for the request
        },
      }
    );

    if (result.status === 402) {
      console.error("Insufficient credits to perform the scrape."); // Handle insufficient credits error
      throw new Error("Insufficient credits to perform the scrape.");
    }

    return result.data; // Return the scraped data

  } catch (error) {
    console.error("Error in the API for scraping website", error.message || error); // Log any errors encountered during the API request
    throw error; // Throw the error to be handled by the caller
  }
}

// Function to create a nested structure of URLs based on their hierarchy
async function createNestedStructure(urls, initialLoc) {
  let urlWithoutTrailingSlash = initialLoc.replace(/\/$/, ""); // Remove the trailing slash from the initial location

  const root = {
    url: urlWithoutTrailingSlash, // Root URL
    location: urlWithoutTrailingSlash, // Root location
    children: [], // Initialize an empty array for child nodes
  };

  for (let url of urls) {
    const pathParts = url.replace(initialLoc, "").split("/").filter(Boolean); // Split URL into parts
    let currentLevel = root; // Start at the root level

    for (let partIndex in pathParts) {
      let part = pathParts[partIndex];
      let fullUrl = `${initialLoc}/${pathParts.slice(0, parseInt(partIndex) + 1).join('/')}`; // Construct full URL for each part

      let existingNode = currentLevel.children.find(child => child.url === part); // Check if the part already exists in the current level

      if (!existingNode) {
        console.log(`Creating node for: ${fullUrl}`); // Log the creation of a new node
        let scrapedData = await scrapeData(fullUrl); // Fetch data asynchronously for each URL part

        existingNode = {
          url: part, // Set the part as the URL
          location: fullUrl, // Set the location for each node
          data: scrapedData, // Add fetched data to the node
          children: [], // Initialize an empty array for child nodes
        };
        currentLevel.children.push(existingNode); // Add the new node to the current level
      }
      currentLevel = existingNode; // Move to the next level in the tree
    }
  }

  console.log("Final nested structure:", JSON.stringify(root, null, 2)); // Log the final nested structure
  return root; // Return the constructed nested structure
}

// Function to extract text from HTML content
function extractTextFromHTML(htmlContent) {
  const root = parse(htmlContent); // Parse the HTML content into a DOM structure
  return root.text.trim().replace(/\s\s+/g, ' '); // Extract and clean textual data, removing extra whitespace
}

// Function to scrape textual data from a website using Puppeteer and Crawlee
async function scrapeWebsiteTextualData() {
  let url = 'https://jsonplaceholder.typicode.com'; // Define the URL to start scraping from
  const crawler = new PuppeteerCrawler({
    async requestHandler({ page, request, enqueueLinks }) {
      console.log(`Scraping ${request.url}`); // Log the URL currently being scraped

      // Handle dropdowns and hover content (commented out)
      // await handleDropdownsAndHovers(page);

      // Extract and process textual data from the page content
      const content = await page.content();
      const textData = extractTextFromHTML(content); // Extract text from the HTML content

      // Save extracted data to a dataset
      await Dataset.pushData({
        url: request.url, // Save the URL of the page
        textData, // Save the extracted text data
      });

      // Optionally, enqueue more links to follow (depth-first scraping)
      await enqueueLinks();
    },
    failedRequestHandler({ request }) {
      console.log(`Failed to scrape ${request.url}`); // Log any URLs that failed to be scraped
      failed_to_fetch_count++;
    },
  });

  // Start the crawling process with the initial URL
  await crawler.run([url]);

  // After the crawl, retrieve all data from the dataset
  const data = await Dataset.getData();
  console.log('Scraped Data:', data.items); // Log the scraped data
  res.json({ scrapedData: data.items }); // Send the scraped data as the response
}



// Function to crawl a website and create a nested structure of the URLs
async function crawlWebsite(req, res) {
  let failed_to_fetch_count = 0; // Counting failed to fetch websites
  let failedUrls = []; // List to store the failed URLs with error messages

  const { url: startUrl } = req.body; // Get the start URL from the request body
  if (!startUrl) {
    return res.status(400).send("URL query parameter is required"); // Send an error response if no URL is provided
  }

  const baseUrl = new URL(startUrl).origin; // Get the base URL (origin) from the start URL
  const visitedUrls = new Set(); // Initialize a set to keep track of visited URLs
  const urlQueue = [startUrl]; // Initialize a queue with the start URL
  const urls = []; // Initialize an array to store the URLs

  while (urlQueue.length > 0) {
    const currentUrl = urlQueue.shift(); // Get the next URL from the queue
    if (visitedUrls.has(currentUrl)) continue; // Skip the URL if it has already been visited

    try {
      // Make an HTTP request to get the page
      const response = await axios.get(currentUrl);
      
      visitedUrls.add(currentUrl); // Mark the current URL as visited
      console.log(`Visited: ${currentUrl}`); // Log the visited URL

      urls.push(currentUrl); // Add the current URL to the list of URLs

      // Extract all anchor links from the page using regex
      const linkMatches = response.data.match(/href="(\/[^"]+|https?:\/\/[^"]+)"/g); // Find href attributes

      if (linkMatches) {
        linkMatches.forEach(linkMatch => {
          const link = linkMatch.match(/href="([^"]+)"/)[1]; // Extract the actual URL from the href
          const absoluteLink = new URL(link, currentUrl).href; // Convert the link to an absolute URL

          if (absoluteLink.startsWith(baseUrl) && !visitedUrls.has(absoluteLink)) { // If the link belongs to the same domain and hasn't been visited
            urlQueue.push(absoluteLink); // Add the link to the queue for further crawling
          }
        });
      }
    } catch (error) {
      console.error(`Failed to fetch ${currentUrl}: ${error.message}`);
      failed_to_fetch_count++;
      failedUrls.push({ url: currentUrl, error: error.message }); // Add the failed URL and the error message to the list
    }
  }

  console.log("Crawling complete"); // Log that the crawling is complete

  const nestedStructure = await createNestedStructure(urls, startUrl); // Create a nested structure of the crawled URLs
  console.log(JSON.stringify(nestedStructure, null, 2)); // Log the nested structure

  // Include the failed URLs in the response
  res.json({
    message: 'Crawling complete',
    nestedStructure,
    failed_to_fetch_count,
    failedUrls, // List of failed-to-fetch URLs
  });

  // Save the nested structure to MongoDB
  try {
    const savedData = new dataScrapModel(nestedStructure); // Create a new instance of the Mongoose model with the nested structure
    await savedData.save(); // Save the data to MongoDB
    console.log("Data saved to MongoDB successfully");
  } catch (error) {
    console.error("Error saving data to MongoDB:", error.message);
    res.status(500).json({ message: 'Error saving data to MongoDB', error: error.message });
  }
}



// Export the functions for use in other modules
module.exports = {
  crawlWebsite, // Function to crawl the website and create a nested structure
}
