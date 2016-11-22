var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var Game = require('../models/games');


router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}));

router.get('/', function(req, res, next) {
  Game.find({}, function(err, docs) {
    if (err) res.send(err);
    console.log("Docs", docs);
    var contentChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize) {
        contentChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('games/index', { title: 'VR Reviewer', games: contentChunks });
  });
})

router.get('/new', function(req, res) {
  console.log("hello");
  console.log(req.user);
  console.log("hello");

  res.render('games/new', { title: 'Add New Game', user: req.user });

});
    //POST a new blob
router.post('/new', function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
    console.log("Body ", req.body);
    var imagePath =  req.body.imagePath;
    var title = req.body.title;
    var description = req.body.description;
    var producer = req.body.producer;
    var releaseDate = req.body.releaseDate;
    //call the create function for our database
    mongoose.model('Game').create({
        imagePath : imagePath,
        title : title,
        description : description,
        producer : producer,
        releaseDate: releaseDate,
    }, function (err, game) {
          if (err) {
              res.send("There was a problem adding the information to the database.");
          }
          //Blob has been created
          console.log('POST creating new game: ' + game);

              res.format({
                  //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                html: function(){
                    // If it worked, set the header so the address bar doesn't still say /adduser
                    res.location("games");
                    // And forward to success page
                    res.redirect("/games/" + game._id);
                },
                //JSON response will show the newly created blob
                json: function(){
                    res.json(game);
                }
            });
    })
});

    // route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Game').findById(id, function (err, game) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                 },
                json: function(){
                       res.json({message : err.status  + ' ' + err});
                 }
            });
        //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            //console.log(blob);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next();
        }
    });
});

router.route('/:id')
  .get(function(req, res) {
    console.log("ID: ", req.id);
    mongoose.model('Game').findById(req.id, function (err, game) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + game._id);
        // var gamedob = game.dob.toISOString();
        // gamedob = gamedob.substring(0, gamedob.indexOf('T'))
        var game = game;
        res.format({
          html: function(){
              res.render('games/show', {
                game : game,
                title: "hello there"
              });
          },
          json: function(){
              res.json(game);
          }
        });
      }
    });
  });

  //GET the individual blob by Mongo ID
router.get('/:id/edit', function(req, res) {
    //search for the blob within Mongo
    mongoose.model('Game').findById(req.id, function (err, game) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
            //Return the blob
            console.log('GET Retrieving ID: ' + game._id);
            //format the date properly for the value to show correctly in our edit form
          var gamedob = game.dob.toISOString();
          gamedob = gamedob.substring(0, gamedob.indexOf('T'))
            res.format({
                //HTML response will render the 'edit.jade' template
                html: function(){
                       res.render('games/edit', {
                          title: 'Game' + blob._id,
                        "gamedob" : gamedob,
                          "game" : game
                      });
                 },
                 //JSON response will return the JSON output
                json: function(){
                       res.json(game);
                 }
            });
        }
    });
});

//PUT to update a blob by ID
router.put('/:id/edit', function(req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var imagePath =  req.body.imagePath;
    var title = req.body.title;
    var description = req.body.description;
    var producer = req.body.producer;
    var releaseDate = req.body.releaseDate;
    var approved = req.body.approved;

   //find the document by ID
        mongoose.model('Game').findById(req.id, function (err, game) {
            //update it
            game.update({
              imagePath : imagePath,
              title : title,
              description : description,
              producer : producer,
              releaseDate: releaseDate,
              approved: approved,
            }, function (err, gameID) {
              if (err) {
                  res.send("There was a problem updating the information to the database: " + err);
              }
              else {
                      //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                      res.format({
                          html: function(){
                               res.redirect("/games/" + game._id);
                         },
                         //JSON responds showing the updated values
                        json: function(){
                               res.json(game);
                         }
                      });
               }
            })
        });
});

//DELETE a Blob by ID
router.delete('/:id/edit', function (req, res){
    //find blob by ID
    mongoose.model('Game').findById(req.id, function (err, game) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            game.remove(function (err, game) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID: ' + game._id);
                    res.format({
                        //HTML returns us back to the main page, or you can create a success page
                          html: function(){
                               res.redirect("/games");
                         },
                         //JSON returns the item with the message that is has been deleted
                        json: function(){
                               res.json({message : 'deleted',
                                   item : game
                               });
                         }
                      });
                }
            });
        }
    });
});

module.exports = router;
