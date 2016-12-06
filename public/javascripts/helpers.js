var expressHbs = require('express-handlebars');
console.log("hello there");
var hbs = expressHbs.create({
  helpers: {
    average: function (ratings, length){
      ratingTotal = '';
      for(var i = 0; i < ratings.length; i++){
        ratingTotal += ratings[i];
      }
      var average = ratingTotal / ratings.length;
      return average;
    },
    createArray: function(reviews){
      var ratings = [];
      for(var i = 0; i < reviews.length; i++){
        ratings.push(reviews)
        return ratings;
      }
    }
  }
});

module.exports = hbs;
