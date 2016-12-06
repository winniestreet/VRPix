var expressHbs = require('express-handlebars');

module.exports = {
  average: function (ratings, length){
      ratingTotal = '';
      for(var i = 0; i < ratings.length; i++){
        ratingTotal += ratings[i];
      }
      var average = ratingTotal / ratings.length;
      return average;
    },
  createArray: function(reviews){
  console.log('creating array');
      var ratings = [];
      for(var i = 0; i < reviews.length; i++){
        ratings.push(reviews)
        return ratings;
      }
    }
  };
