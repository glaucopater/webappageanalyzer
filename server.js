const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

//to build correct path according to platform
app.use(express.static(path.join(__dirname, "build")));

//method to check if the api is alive
app.get("/api/ping", (req, res) => {
  console.log("GET /api/ping");
  res.send({ express: "pong" });
});

app.get("/api/checkLinks", (req, res) => {
  var url = require("url");
  //to explode the querystring looking for parameter
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  const links = req.query.links; // $_GET["links"]
  var crawler = require("./crawler");

  crawler.checkLinks(links, function(result) {
    var jsonString = JSON.stringify({ aliveLinks: result });

    res.write(jsonString);
    res.end();
  });
});

app.get("/api/crawle", (req, res) => {
  var url = require("url");
  //to explode the querystring looking for parameter
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var link = req.query.link; // $_GET["link"]
  var crawler = require("./crawler");

  crawler.crawlePage(link, function(result) {
    let info = [];
    let error = null;

    if (result["StatusCode"] === 200) {
      let information = [];
      let internalLinks = [];
      let externalLinks = [];

      information = result["information"];

      info.push({
        id: info.length,
        propertyName: "Document Version",
        propertyValue: information["DOCTYPE"]
      });
      info.push({
        id: info.length,
        propertyName: "Title",
        propertyValue: information["Title"]
      });
      info.push({
        id: info.length,
        propertyName: "H1",
        propertyValue: information["H1"]
      });
      info.push({
        id: info.length,
        propertyName: "H2",
        propertyValue: information["H2"]
      });
      info.push({
        id: info.length,
        propertyName: "H3",
        propertyValue: information["H3"]
      });
      info.push({
        id: info.length,
        propertyName: "H4",
        propertyValue: information["H4"]
      });
      info.push({
        id: info.length,
        propertyName: "H5",
        propertyValue: information["H5"]
      });
      info.push({
        id: info.length,
        propertyName: "H6",
        propertyValue: information["H6"]
      });
      info.push({
        id: info.length,
        propertyName: "Internal links",
        propertyValue: result["internalLinks"].length
      });
      info.push({
        id: info.length,
        propertyName: "External links",
        propertyValue: result["externalLinks"].length
      });

      info.push({
        id: info.length,
        propertyName: "Login Form",
        propertyValue: information["LoginForm"]
      });
      internalLinks = result["internalLinks"];
      externalLinks = result["externalLinks"];

      var jsonString = JSON.stringify({
        info: info,
        internalLinks: internalLinks,
        externalLinks: externalLinks,
        error: error
      });

      res.write(jsonString);
    } else {
      //Some error has occurred...
      error = result["error"];
      var jsonString = JSON.stringify({ info: info, error: error });
      res.write(jsonString);
    }

    res.end();
  });
});

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(process.env.PORT || 8080);
