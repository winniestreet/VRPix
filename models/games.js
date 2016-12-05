var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    imagePath: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    producer: {type: String, required: true},
    releaseDate: {type: String},
    approved: {type: Boolean, default: false}
});

module.exports = mongoose.model('Game', schema);
