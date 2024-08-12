// index.js
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const xml2js = require("xml2js");
// const fs = require("fs");
require("dotenv").config();
const mainRouter = require('./routes/mainRouter');

const app = express();
const port = 5000;

// Middleware
// app.use(bodyParser.json());
app.use(express.json({limit: '1024mb'}));
app.use(express.urlencoded({limit: '1024mb', extended: true, parameterLimit: 500000}))
app.use('/',mainRouter);

// Connect to MongoDB
const dbPass = process.env.DB_PASS;
mongoose.connect(
  `mongodb+srv://yirigaacluster:${dbPass}@yirigaa-cluster.rfa7hy1.mongodb.net/?retryWrites=true&w=majority&appName=yirigaa-cluster`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);



app.listen(port, () => console.log(`Server running on port ${port}`));
