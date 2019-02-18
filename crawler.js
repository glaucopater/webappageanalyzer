var request = require("request-promise");
var cheerio = require("cheerio");
var async = require("async");
var URL = require("url-parse");

var link = "";
var host = link;

module.exports = {
  checkLinks: function(links, callback) {
    var aliveCounter = 0;

    links.forEach((item, index, array) => {
      checkAlive(item, check => {
        aliveCounter += check;
        itemsProcessed++;
        if (itemsProcessed === array.length) {
          cb(aliveCounter);
          callback(aliveCounter.toString());
        }
      });
    });
  },

  crawlePage: function(link, callback) {
    var rp = require("request-promise");
    var options = {
      uri: link,
      headers: {
        "User-Agent": "Request-Promise"
      },
      json: true, //, // Automatically parses the JSON string in the response
      //insecure: true
      resolveWithFullResponse: true
    };
    rp(options)
      .then(function(response) {
        let results = [];
        let information = [];

        results["StatusCode"] = response.statusCode;

        // Parse the document body
        var $ = cheerio.load(response.body);

        //Info 1: What is the HTML version?
        information["DOCTYPE"] = $("DOCTYPE").text();

        //Info 2: What is the title of the page?
        information["Title"] = $("title").text();

        //Info 3: How many headings of WHAT level?
        for (var i = 1; i < 7; i++) {
          var headingCount = "H" + i;
          information[headingCount] = $("H" + i).length;
        }

        //info 4:How many internal and external links are in the document? Are there any inaccessible links and how many?

        let internalLinks = [];

        $("a[href^='/']").each(function() {
          internalLinks.push($(this).attr("href"));
        });

        let internalLinksAlive = 0;

        let externalLinks = [];
        $("a[href^='http']").each(function() {
          externalLinks.push($(this).attr("href"));
        });

        let ExternalAliveLinks = 0;
        //chain of multiple async request
        //ExternalAliveLinks = asyncEach(externalLinks);

        information["LoginForm"] = "No";
        //Info 5: Did the page contain a login-form?
        //Simple heuristic to find a login form: it should be a form element
        //containing a password input field
        if (
          $("form")
            .find(":password")
            .data()
        ) {
          information["LoginForm"] = "Yes";
        }

        results["information"] = information;
        //remove duplicated links
        results["internalLinks"] = Array.from(new Set(internalLinks));
        results["externalLinks"] = Array.from(new Set(externalLinks));

        callback(results);
      })
      .catch(function(err) {
        // API call failed...
        let error = [];
        const errorMessage = "Cannot reach the page";
        error["error"] = errorMessage;
        callback(error);
      });
  }
};

//check only for http 200
function checkAlive(link, callback) {
  var rp = require("request-promise");
  var options = {
    uri: link,
    headers: {
      "User-Agent": "Request-Promise"
    },
    resolveWithFullResponse: true,
    timeout: 100
  };
  rp(options)
    .then(function(response) {
      //increment counter for alive links
      callback(1);
    })
    .catch(function(err) {
      // API call failed...
      //no increment
      callback(0);
    });
}

function cb(aliveCounter) {
  console.log("all done: " + aliveCounter);
}

var itemsProcessed = 0;