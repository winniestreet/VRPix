var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var Review = require('../models/reviews');
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

router.get('/new', function(req, res) {
  res.render('reviews/new', { title: 'Add a review', user: req.user });

});
    //POST a new blob
router.post('/new', function(req, res) {
  console.log("here");
  console.log(req.game);
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
    var immersionRating = req.body.immersion;
    var visualsRating = req.body.visuals;
    var soundRating = req.body.sound;
    var gameplayRating = req.body.gameplay;
    var interactionRating = req.body.interaction;
    var comment = req.body.comment;
    var gameID = req.game._id;
    var userID = req.user._id;
    // Chi wanted me to put a comma in here, but I am putting a comment in instead so he thinks I am doing what he asked
    //call the create function for our database
    mongoose.model('Review').create({
        immersionRating : immersionRating,
        visualsRating : visualsRating,
        soundRating : soundRating,
        gameplayRating : gameplayRating,
        interactionRating : interactionRating,
        comment : comment,
        gameID : gameID,
        userID : userID

    }, function (err, review) {
          if (err) {
              res.send("There was a problem adding the information to the database.");
          }
          //Blob has been created
          console.log('POST creating new review: ' + review);

              res.format({
                  //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                html: function(){
                    // If it worked, set the header so the address bar doesn't still say /adduser
                    res.location("games");
                    console.log(game._id);

                    // And forward to success page
                    res.redirect("/games/" + review.gameID);
                },
                //JSON response will show the newly created blob
                json: function(){
                    res.json(review);
                }
            });
    })
});

    // route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Review').findById(id, function (err, review) {
        //if it isn't found, we are going to repond with 404
        if (err) {
          console.log(review);
            console.log(id + ' was not found + here');
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

router.route('/review/:id')
  .get(function(req, res) {
    console.log("ID: ", req.id);
    mongoose.model('Review').findById(req.id, function (err, review) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + review._id);
        // var gamedob = game.dob.toISOString();
        // gamedob = gamedob.substring(0, gamedob.indexOf('T'))
        res.format({
          html: function(){
              res.render('reviews/show', {
                review : review,
                title: "hello there",
                user: req.user
              });
            },
          json: function(){
            res.json(review);
          }
        });
      }
    });
  });

  //GET the individual blob by Mongo ID
router.get('/review/:id/edit', isLoggedInAsReviewer, function(req, res) {
    //search for the blob within Mongo
    mongoose.model('Review').findById(req.id, function (err, review) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
            //Return the blob
            console.log('GET Retrieving ID: ' + review._id);
            //format the date properly for the value to show correctly in our edit form
          // var gamedob = game.dob.toISOString();
          // gamedob = gamedob.substring(0, gamedob.indexOf('T'))
            res.format({
                //HTML response will render the 'edit.jade' template
                html: function(){
                       res.render('reviews/edit', {
                          title: 'Review' + review._id,
                        // "gamedob" : gamedob,
                          "review" : review,
                          user: req.user
                      });
                 },
                 //JSON response will return the JSON output
                json: function(){
                       res.json(review);
                 }
            });
        }
    });
});

//PUT to update a blob by ID
router.put('review/:id/edit', function(req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var immersionRating = req.body.immersion;
    var visualsRating = req.body.visuals;
    var soundRating = req.body.sound;
    var gameplayRating = req.body.gameplay;
    var interactionRating = req.body.interaction;
    var comment = req.body.comment;
    var gameID = req.game._id;
    var userID = req.user._id;

   //find the document by ID
        mongoose.model('Review').findById(req.id, function (err, review) {
            //update it
            review.update({
              immersionRating : immersionRating,
              visualsRating : visualsRating,
              soundRating : soundRating,
              gameplayRating : gameplayRating,
              interactionRating : interactionRating,
              comment : comment,
              gameID : gameID,
              userID : userID,
            }, function (err, reviewID) {
              if (err) {
                  res.send("There was a problem updating the information to the database: " + err);
              }
              else {
                      //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                      res.format({
                          html: function(){
                               res.redirect("/games/review/" + review._id);
                         },
                         //JSON responds showing the updated values
                        json: function(){
                               res.json(review);
                         }
                      });
               }
            })
        });
});

//DELETE a Blob by ID
router.delete('/:id/edit', isLoggedInAsReviewer, function (req, res){
    //find blob by ID
    mongoose.model('Review').findById(req.id, function (err, review) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            review.remove(function (err, review) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID: ' + review._id);
                    res.format({
                        //HTML returns us back to the main page, or you can create a success page
                          html: function(){
                               res.redirect("/games/" + game._id);
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

function isLoggedInAsReviewer(req, res, next) {
  console.log("another");
  if (req.isAuthenticated() && req.user === req.review.user._id)  {
    return next();
  }
  res.redirect('/games/' + game._id);
}
