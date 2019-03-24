var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose');

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require('axios');
var cheerio = require('cheerio');

// Require all models
var db = require('./models');

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger('dev'));
// Parse request body as JSON
app.use(express.urlencoded({extended: true}));
app.use(express.json());
// Make public a static folder
app.use(express.static('public'));

// Connect to the Mongo DB
mongoose.connect('mongodb://localhost/scienceScraper', {useNewUrlParser: true});

// Routes

// A GET route for scraping the echoJS website
app.get('/scrape', function(req, res) {
  axios.get('https://sciworthy.com/').then(function(response) {
    var $ = cheerio.load(response.data);

    $("article").each(function(i, element) {
      var article = {};

      var title = $(element)
        .find('.entry-title-primary')
        .text();
      var summary = $(element)
        .find('.entry-subtitle')
        .text();
      var link = $(element)
        .find('.hvr-underline-reveal')
        .attr('href');
      var photo = $(element)
        .find('.attachment-tromax-sq-thumb')
        .attr('src');

      // Add title, summary, link and photo result object
      article.title = title;
      article.summary = summary;
      article.link = link;
      article.photo = photo;

      // Create a new Article with the article from cheerio
      db.Article.create(article)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log('There is an error in your code ', err);
        });
    });
    res.send('Operation Science 👩‍🔬 Scrape Completed ⚒');
  });
});

// Route for getting all Articles from the db
app.get('/articles', function(req, res) {
  db.Article.find({}).then(function(articles) {
    res.json(articles);
  });
});

// Route for grabbing a specific Article by id, populate it with it's note
// app.get("/articles/:id", function(req, res) {
//   db.Article.findOne({_id: req.params.id})
//     .populate("note")
//     .then(function(dbArticle){
//       res.json(dbArticle)
//     })
//     .catch(function(err){
//       res.json(err);
//     });
// });

//   // First, we grab the body of the html with axios
//   axios.get("http://www.echojs.com/").then(function(response) {
//     // Then, we load that into cheerio and save it to $ for a shorthand selector
//     var $ = cheerio.load(response.data);

//     // Now, we grab every h2 within an article tag, and do the following:
//     $("article h2").each(function(i, element) {
//       // Save an empty result object
//       var result = {};

//       // Add the text and href of every link, and save them as properties of the result object
//       result.title = $(this)
//         .children("a")
//         .text();
//       result.link = $(this)
//         .children("a")
//         .attr("href");

//       // Create a new Article using the `result` object built from scraping
//       db.Article.create(result)
//         .then(function(dbArticle) {
//           // View the added result in the console
//           console.log(dbArticle);
//         })
//         .catch(function(err) {
//           // If an error occurred, log it
//           console.log(err);
//         });
//     });

//     // Send a message to the client
//     res.send("Scrape Complete");
//   });
// });

// Route for getting all Articles from the db
// app.get("/articles", function(req, res) {
//   // TODO: Finish the route so it grabs all of the articles
//   db.Article.find({})
//   .then(function (articles){
//     res.json(articles);
//   });
// });

// // Route for grabbing a specific Article by id, populate it with it's note
// app.get("/articles/:id", function(req, res) {
//   db.Article.findOne({_id: req.params.id})
//     .populate("note")
//     .then(function(dbArticle){
//       res.json(dbArticle)
//     })
//     .catch(function(err){
//       res.json(err);
//     });
//   // TODO
//   // ====
//   // Finish the route so it finds one article using the req.params.id,
//   // and run the populate method with "note",
//   // then responds with the article with the note included
// });

/*
// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
  db.Note.create(req.body)
  .then(function(dbNote) {
    return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
  })
  .then(function(dbUser) {
    res.json(dbUser);
  })
  .catch(function(err) {
    res.json(err);
  });
});
*/

// Start the server
app.listen(PORT, function() {
  console.log('App running on port ' + PORT);
});