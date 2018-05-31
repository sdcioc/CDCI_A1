var rss2json = require('rss-to-json');
var Feed = require('feed')
var RSS = require('rss');
var express = require("express");
var bodyParser = require('body-parser');
var cors = require('cors')
const app = express();
var PORT = 80;
var http = require('http');
var request = require('request');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

var httpServer = http.createServer(app);
httpServer.listen(PORT, function () {
    console.log("Server started at port 80");
});

app.use(function(req, res, next){
  console.log('Am primit cerere', Date.now());
  next();
});

dbItems = [];

app.get("/rss.xml/:category/:author/:searchTitle/:searchContent", function(req, res) {
  var myCategory = req.params.category;
  var myAuthor = req.params.author;
  var mySearchTitle = req.params.searchTitle;
  var mySearchContent = req.params.searchContent;

  res.contentType("rss");
  var feed = new RSS({
    title: "Ciocirlan's RSS FEED",
    description: 'The RSS feed from Ciocirlan',
    feed_url: 'http://example.com/rss.xml',
    site_url: 'http://example.com',
    managingEditor: 'stefan_dan@xn--ciocrlan-o2a.ro (Ciocirlan Stefan-Dan)',
    webMaster: 'stefan_dan@xn--ciocrlan-o2a.ro (Ciocirlan Stefan-Dan)',
    copyright: '2018 Ciocirlan Stefan-Dan',
    language: 'en',
    categories: ['cybersecurity','linux','IT', 'windows', 'security', 'laws', 'politics'],
    pubDate: new Date(),
    ttl: '60'
  });
  for (item of dbItems) {
    //console.log(item.title, "\n", item.link, "\n")
    var accept = true;
    if (myCategory === "all") {

    } else {
      if (typeof item.categories  !== 'undefined') {
        if (item.categories.includes(myCategory)) {
          
        } else {
          accept = false;
        }
      } else {
        accept = false;
      }
    }
    if (myAuthor === "all") {

    } else {
        if (item.author === myAuthor) {
          
        } else {
          accept = false;
        }
    }
    if (mySearchTitle === "all") {

    } else {
        if (item.title.includes(mySearchTitle)) {
          
        } else {
          accept = false;
        }
    }

    if (mySearchContent === "all") {

    } else {
        if (item.content.includes(mySearchContent)) {
          
        } else {
          accept = false;
        }
    }

    if (accept == true) {
      feed.item({
        title:  item.title,
        description: item.description,
        url: item.link,
        pubDate: item.pubDate,
        author: item.author,
        categories: item.categories,
        content : item.content
      });
    }
  }
  var repsonseXML=feed.xml();
  res.send(repsonseXML);
  //console.log("----XML------", repsonseXML);
  console.log("---------TERMINAT trimis răspuns ---------");
});

var newGetNewsFunction = () => {
  return new Promise((resolve, reject) => {
  var links = [
    //"http://feeds.feedburner.com/eset/blog",
    "https://securingtomorrow.mcafee.com/feed",
    //"http://krebsonsecurity.com/feed/",
    "http://www.darkreading.com/rss/all.xml",
    //"https://www.schneier.com/blog/atom.xml", periculosul
    "https://threatpost.com/feed",
    "http://nakedsecurity.sophos.com/feed/",
    //"http://feeds.feedburner.com/GoogleOnlineSecurityBlog", periculos
    "https://www.grahamcluley.com/feed",
    "http://www.infosecurity-magazine.com/rss/news/",
    "http://www.csoonline.com/index.rss",
    "https://www.symantec.com/connect/item-feeds/all/all/feed/all/all/all",
    "http://securityaffairs.co/wordpress/feed",
    "http://www.cio.com/category/security/index.rss",
    "http://software-security.sans.org/blog/feed/",
    "http://www.zonealarm.com/blog/index.php/feed/",
    "https://www.troyhunt.com/feed"//,
    //"http://blogs.rsa.com/feed/",
    //"https://www.helpnetsecurity.com/feed",
    //"https://itsecuritycentral.teramind.co/feed"
  ];

  new Promise ((resolve, reject) => {
    var myFunc = (index) => {
        if(index==links.length) {
            resolve()
        } else {
          request("https://api.rss2json.com/v1/api.json?rss_url=" + links[index], function (error, response, body){
            if (!error && response.statusCode == 200) {
              //console.log("bodyy", body);
              console.log("index", index);
              //console.log("body", body);
              var myRSSjson = JSON.parse(body);
              //console.log("body items", myRSSjson.items);
              for (indexus in myRSSjson.items) {
                dbItems.push(myRSSjson.items[indexus]);
              }
              console.log("index--final", index, "/", links.length);
              myFunc(index+1);
            }
          });
          /*
          rss2json.load(links[index], function(err, rss) {
            if(err) {
              console.log("err", err);
              reject(err);
            }
            console.log("index", index);
            for (indexus in rss.items) {
              dbItems.push(rss.items[indexus]);
            }
            console.log("index--final", index, "/", links.length);
            myFunc(index+1);
          });
          */
        }
    }
    myFunc(0);
  }).then(() => {
      console.log("-------A descacat tot -------")
      resolve();
  }, (err) => {
      console,log("err", err);
      reject(err);
  });
});
};

newGetNewsFunction().then(()=>{
  console.log("TERMINAT incarcat database");

});