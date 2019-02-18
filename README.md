Documentation
===


Web Page Information analyzed
---
* Doctype for HTML version 
* Page Title from Head tag
* Headings (h1,h2,h3,h4,h5,h6) and related quantity
* Internal links and external links parsing href properties of "a" tags (duplicated links are removed).
* Simple heuristic to find a login form (the page should contain a form element with an input password field )


How to use the downloaded files
===

1) Run "npm install" in the extracted folder
2) Run "node .\server.js" to run the server 
3) Run "npm start" to start the project


## Package used on backend side

-  cheerio: for HTML parsing, useful for dynamic content
-  express 
-  request-promise, async: for async calls

## Package used on frontend side

-  React Js (React Dom, React Script)
-  Axios : for ajax requests

## Backend Logic

Server.js
===
Rest API entry point. The server js exposes the api and Rest API using the Crawler module


Crawler.js
===
This module parse a web page getting information about: Document Version, 
Page Title, Heading counts by type (h1,h2,h3...), all the inner external and internal links (href).
For each of this link another call is performed in order to find if the link is alive or not.
Only HTTP 200 responses are managed as "alive" ones.
The crawler also considers https links using the related client.

## Frontend Logic

InputForm (Statefull Component)
==
Component containing the results of a page analyze.


Information (Stateless Component)
==
Component containing a single row related to a type of result.
