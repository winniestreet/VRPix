var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  gameID: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
  userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  immersionRating: { type: Number, required: true},
  visualsRating: { type: Number, required: true},
  soundRating: { type: Number, required: true},
  gameplayRating: { type: Number, required: true},
  interactionRating: { type: Number, required: true},
  comment: { type: String }
});

module.exports = mongoose.model('Review', schema);
