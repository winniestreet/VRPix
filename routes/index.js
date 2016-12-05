var express = require('express');
var router = express.Router();
var Game = require('../models/games');

/* GET home page. */

router.get('/', function(req, res, next) {
  Game.find({approved: true}, function(err, docs) {
    if (err) res.send(err);
    console.log("req.user");
    var contentChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize) {
        contentChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('games/index', { title: 'VR Reviewer', games: contentChunks, user: req.user });
  });
});


module.exports = router;
