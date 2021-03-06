// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');
var fs = require('fs');
// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 1729; // set our port

var mongoose   = require('mongoose');
mongoose.connect('mongodb://admin:saltywalrus@ds161580.mlab.com:61580/vizzy'); // connect to our database
var Post     = require('./app/models/post');

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next();
});

// test route to make sure everything is working (accessed at GET http://localhost:1729/api)
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to the Vizzy API!' });
});

//get vizzy today!
router.get('/mac', function(req, res) {
    fs.readFile(__dirname+'/assets/mac.zip', (err, data) => {
      if (err) throw err;
      res.set('Content-Type', 'application/zip')
      res.set('Content-Disposition', 'attachment; filename=mac.zip');
      res.set('Content-Length', data.length);
      res.end(data, 'binary');
    });
});

router.get('/linux64', function(req, res) {
    fs.readFile(__dirname+'/assets/linux64.zip', (err, data) => {
      if (err) throw err;
      res.set('Content-Type', 'application/zip')
      res.set('Content-Disposition', 'attachment; filename=linux64.zip');
      res.set('Content-Length', data.length);
      res.end(data, 'binary');
    });
});

router.get('/linux32', function(req, res) {
    fs.readFile(__dirname+'/assets/linux32.zip', (err, data) => {
      if (err) throw err;
      res.set('Content-Type', 'application/zip')
      res.set('Content-Disposition', 'attachment; filename=linux32.zip');
      res.set('Content-Length', data.length);
      res.end(data, 'binary');
    });
});

router.get('/windows32', function(req, res) {
    fs.readFile(__dirname+'/assets/windows32.zip', (err, data) => {
      if (err) throw err;
      res.set('Content-Type', 'application/zip')
      res.set('Content-Disposition', 'attachment; filename=windows32.zip');
      res.set('Content-Length', data.length);
      res.end(data, 'binary');
    });
});

router.get('/windows64', function(req, res) {
    fs.readFile(__dirname+'/assets/windows64.zip', (err, data) => {
      if (err) throw err;
      res.set('Content-Type', 'application/zip')
      res.set('Content-Disposition', 'attachment; filename=windows64.zip');
      res.set('Content-Length', data.length);
      res.end(data, 'binary');
    });
});



// on routes that end in /posts
// ----------------------------------------------------
router.route('/posts')

    // create a post (accessed at POST http://localhost:1729/api/posts)
    .post(function(req, res) {

        var post = new Post();		// create a new instance of the Post model
        post.message = req.body.message;  // set the posts message
        post.posted = Date().toLocaleString();   //set the posts Date
        post.vizzy = req.body.vizzy;


        post.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Post created!' });
        });


    })

    // get all the posts (accessed at GET http://localhost:1729/api/posts)
    .get(function(req, res) {
        Post.find({$query: {}}).limit(25).sort({posted: 'desc'}).exec(function(err, posts) {
            if (err)
                res.send(err);

            res.json(posts);
        });
    });


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('REST API Listening @ http://localhost:' + port+"/api");
