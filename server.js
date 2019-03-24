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
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({_id: req.params.id})
    .populate("comment")
    .then(function(dbArticle){
      res.json(dbArticle)
    })
    .catch(function(err){
      res.json(err);
    });
});


// Route for saving/updating an Article's associated Comment
app.post("/articles/:id", function(req, res) {
  db.Comment.create(req.body)
  .then(function(dbComment) {
    return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: {comments: dbComment._id} }, { new: true });
  })
  .then(function(dbUser) {
    res.json(dbUser);
  })
  .catch(function(err) {
    res.json(err);
  });
});


// Start the server
app.listen(PORT, function() {
  console.log('App running on port ' + PORT);
});
