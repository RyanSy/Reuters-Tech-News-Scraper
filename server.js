//Dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');


//Middleware
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static('public'));


//Database configuration
mongoose.connect('mongodb://localhost/mongoosescraper');
var db = mongoose.connection;

db.on('error', function(err) {
    console.log('Mongoose Error: ', err);
});
db.once('open', function() {
    console.log('Mongoose connection successful.');
});


//Require Schemas
var Note = require('./models/Note.js');
var Article = require('./models/Article.js');


//Routes
app.get('/', function(req, res) {
    res.send(index.html);
});

app.get('/scrape', function(req, res) {
    request('http://www.reuters.com/news/archive/technologyNews?view=page', function(error, response, html) {
        var $ = cheerio.load(html);
        $('div.story-content').each(function(i, element) {

            var result = {};

            result.title = $(this).children('h3').text();
            result.summary = $(this).children('p').text();

            var entry = new Article(result);

            entry.save(function(err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(doc);
                }
            });
        });
    });
    res.send("Scrape Complete");
});

app.get('/articles', function(req, res) {
    Article.find({}, function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            res.json(doc);
        }
    });
});

app.post('/articles/:id', function(req, res) {
    var newNote = new Note(req.body);
    newNote.save(function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log(doc.body);
            res.send(doc);
            console.log(req.params.id);
            Article.findOneAndUpdate({
                    '_id': req.params.id
                }, {
                    'note': doc._id
                })
                .exec(function(err, doc) {
                    if (err) {
                        console.log(err);
                    }
                });
        }
    });
});

app.post('/notes', function(req, res) {
  console.log(req.body);
    Note.findOne({
            '_id':req.body
        })
        .exec(function(err, doc) {
            if (err) {
                console.log(err);
            } else {
                res.json(doc);
                console.log(doc);
            }
        });
});

app.post('/notes/delete', function(req, res) {
  console.log(req.body);
    Note.findOneAndRemove({
            '_id':req.body
        })
        .exec(function(err, doc) {
            if (err) {
                console.log(err);
            } else {
                console.log("Note Deleted");
            }
        });
});


//Server connection
app.listen(3006, function() {
    console.log('App running on port 3006!');
});
