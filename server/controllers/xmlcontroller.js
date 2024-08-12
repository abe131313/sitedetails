// Importing the library
const fs = require("fs");
const xml2js = require("xml2js");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

// Importing the models needed to save to the DB
const xmlDataModel = require("../models/xmlFile.js");

// Function to create a nested structure based on URL hierarchy
function createNestedStructure(urls,initialLoc) {
  let urlWithTrailingSlash = initialLoc;
  let urlwithoutTrailingslash;
  urlwithoutTrailingslash = urlWithTrailingSlash.replace(/\/$/, "");
//   console.log(urlwithoutTrailingslash); // Output: "www.skillsoft.com"

  const root = {
    url: urlwithoutTrailingslash,
    data:null,
    location: initialLoc,
    lastmodified: null,
    changefrequency: null,
    priority: null,
    children: [],
  };

  urls.forEach((urlObj) => {
    const pathParts = urlObj.loc[0]
      .replace(initialLoc, "")
      .split("/")
      .filter(Boolean);
    let currentLevel = root;

    pathParts.forEach((part, index) => {
      let existingNode = currentLevel.children.find(
        (child) => child.url === part
      );

      if (!existingNode) {
        existingNode = {
          url: part,
          location: urlObj.loc[0],
          lastmodified:
            index === pathParts.length - 1 ? urlObj.lastmod[0] : null,
          changefrequency:
            index === pathParts.length - 1 ? urlObj.changefreq[0] : null,
          priority: index === pathParts.length - 1 ? urlObj.priority[0] : null,
          children: [],
        };
        currentLevel.children.push(existingNode);
      }

      currentLevel = existingNode;
    });
  });

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
    const output = createNestedStructure(result.urlset.url,result.urlset.url[0].loc[0]);

    // test
    // console.log(result.urlset.url[0].loc[0]);

    // Display the nested tree result
    console.log(JSON.stringify(output, null, 2));
    // console.log(output);

    // Process the parsed data as needed
    // console.log(result);

    // Respond with success
    res
      .status(200)
      .json({ message: "XML data processed successfully", data: result });
    //   .json({ message: "XML data processed successfully", data: output });
  });
}

// Handle processing of XML file
// exports.processXMLFile = (req, res) => {
//   fs.readFile("sample.xml", "utf8", (err, xmlData) => {
//     if (err) {
//       return res.status(500).json({ error: "Failed to read XML file" });
//     }

//     xml2js.parseString(xmlData, (err, result) => {
//       if (err) {
//         return res.status(400).json({ error: "Failed to parse XML" });
//       }

//       // Process the parsed data as needed
//       console.log(result);

//       // Respond with success
//       res
//         .status(200)
//         .json({ message: "XML file processed successfully", data: result });
//     });
//   });
// };

// Function to handle the crawling
async function crawlWebsite(req, res) {
  const startUrl = req.query.url;
  if (!startUrl) {
    return res.status(400).send("URL query parameter is required");
  }

  const baseUrl = new URL(startUrl).origin;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const visitedUrls = new Set();
  const urlQueue = [startUrl];
  const siteStructure = {
    url: startUrl,
    children: [],
    location: startUrl,
    lastmodified: null,
    changefrequency: null,
    priority: null,
  };

  // Function to add a node to the site structure
  const addNode = (parentNode, url, metadata = {}) => {
    const absoluteUrl = new URL(url, baseUrl).href;
    const newNode = {
      url: absoluteUrl,
      children: [],
      location: absoluteUrl,
      lastmodified: metadata.lastmodified || null,
      changefrequency: metadata.changefrequency || null,
      priority: metadata.priority || null,
    };

    if (parentNode.url === baseUrl || absoluteUrl.startsWith(parentNode.url)) {
      parentNode.children.push(newNode);
      return newNode;
    } else {
      for (const child of parentNode.children) {
        const result = addNode(child, url, metadata);
        if (result) return result;
      }
    }
    return null;
  };

  while (urlQueue.length > 0) {
    const currentUrl = urlQueue.shift();
    if (visitedUrls.has(currentUrl)) continue;

    await page.goto(currentUrl);
    const content = await page.content();
    const $ = cheerio.load(content);

    visitedUrls.add(currentUrl);
    console.log(`Visited: ${currentUrl}`);

    // Extract metadata
    const metadata = {
      lastmodified: $('meta[name="lastmod"]').attr("content"),
      changefrequency: $('meta[name="changefreq"]').attr("content"),
      priority: $('meta[name="priority"]').attr("content"),
    };

    $('a[href^="/"], a[href^="' + baseUrl + '"]').each((index, element) => {
      const link = $(element).attr("href");
      const absoluteLink = new URL(link, currentUrl).href;

      if (absoluteLink.startsWith(baseUrl) && !visitedUrls.has(absoluteLink)) {
        urlQueue.push(absoluteLink);
        addNode(siteStructure, link, metadata);
      }
    });
  }

  await browser.close();
  console.log("Crawling complete");
  fs.writeFileSync(
    "siteStructure.json",
    JSON.stringify(siteStructure, null, 2)
  );
  console.log("Site structure saved to siteStructure.json");
  res.send("Crawling complete. Check siteStructure.json for results.");
}

// Export the crawlWebsite function
module.exports = {
  uploadXML, // Assuming you have this function defined elsewhere
  crawlWebsite,
};
