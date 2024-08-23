// Importing the library
const fs = require("fs");
const xml2js = require("xml2js");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const axios = require("axios");

// Function to scrape the textual data of a website
async function scrapeData(url) {
  try {
    let result = await axios.post(
      "https://api.scraptio.com/scrape",
      {
        url: url,
        api_key:
          "MrnJ7uSbbCXbbKTlQOnKqx8mHMxnhS2s1wzWySaBSuRm55gTFLZJpSoQXq1GtFsx",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return result.data;
  } catch (error) {
    console.error("error in the api for scrapping website", error);
    throw error;
  }
}

// Function to create a nested tree JSON structure of all the links searched using the headless browser. 
function createNestedStructure(urls, initialLoc) {
    let urlWithoutTrailingSlash = initialLoc.replace(/\/$/, "");
  
    const root = {
      url: urlWithoutTrailingSlash,
      location: urlWithoutTrailingSlash,
      children: [],
    };
  
    for (let url of urls) {
      const pathParts = url
        .replace(initialLoc, "")
        .split("/")
        .filter(Boolean);
  
      let currentLevel = root;
  
      for (let partIndex in pathParts) {
        let part = pathParts[partIndex];
        let existingNode = currentLevel.children.find(
          (child) => child.url === part
        );
  
        if (!existingNode) {
          existingNode = {
            url: part,
            location: `${initialLoc}/${pathParts.slice(0, parseInt(partIndex) + 1).join('/')}`,
            data: null,
            children: [],
          };
          currentLevel.children.push(existingNode);
        }
        currentLevel = existingNode;
      }
    }
  
    return root;
  }
  

// Handle XML upload
function uploadXML(req, res) {
  const xmlData = req.body.xmlData;
  xml2js.parseString(xmlData, (err, result) => {
    if (err) {
      return res.status(400).json({ error: "Failed to parse XML" });
    }

    // Create the nested structure
    const output = createNestedStructure(
      result.urlset.url,
      result.urlset.url[0].loc[0]
    );

    // test
    // console.log(result.urlset.url[0].loc[0]);

    // Display the nested tree result
    // console.log(JSON.stringify(output, null, 2));
    // console.log(output);

    // Process the parsed data as needed
    // console.log(result);

    // Respond with success
    res
      .status(200)
      //   .json({ message: "XML data processed successfully", data: result });
      .json({ message: "XML data processed successfully", data: output });
  });
}

// Function to save the data to mongoDB collection
async function saveData(){
    console.log('in save data function');
}

async function crawlWebsite(req, res) {
    const { url: startUrl } = req.body;
    if (!startUrl) {
      return res.status(400).send("URL query parameter is required");
    }
  
    const baseUrl = new URL(startUrl).origin;
  
    const browser = await puppeteer.launch(); 
    const page = await browser.newPage(); 
    const visitedUrls = new Set();
    const urlQueue = [startUrl];
    const urls = [];
  
    while (urlQueue.length > 0) {
      const currentUrl = urlQueue.shift();
      if (visitedUrls.has(currentUrl)) continue;
  
      await page.goto(currentUrl);
      const content = await page.content();
      const $ = cheerio.load(content);
  
      visitedUrls.add(currentUrl);
      console.log(`Visited: ${currentUrl}`);
  
      urls.push(currentUrl);
  
      $('a[href^="/"], a[href^="' + baseUrl + '"]').each((index, element) => {
        const link = $(element).attr("href");
        const absoluteLink = new URL(link, currentUrl).href;
  
        if (absoluteLink.startsWith(baseUrl) && !visitedUrls.has(absoluteLink)) {
          urlQueue.push(absoluteLink);
        }
      });
    }
  
    await browser.close();
    console.log("Crawling complete");
  
    const nestedStructure = createNestedStructure(urls, startUrl);
    console.log(JSON.stringify(nestedStructure, null, 2));
  
    res.json(nestedStructure);
  }
  
  
  

// Export the crawlWebsite function
module.exports = {
  uploadXML, // Assuming you have this function defined elsewhere
  crawlWebsite,
  scrapeData,
};
