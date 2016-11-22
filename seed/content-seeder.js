var Game = require('../models/games');
var mongoose = require('mongoose');

mongoose.connect('localhost:27017/games');
mongoose.Promise = global.Promise;

var games = [
    new Game({
    imagePath: 'https://i.ytimg.com/vi/bM47bOeHSL4/maxresdefault.jpg',
    title: 'Fantastic Contraption',
    description: "The new Fantastic Contraption has been designed from the ground up for room-scale VR. Imagine walking around a grassy island in the sky while you build a machine the size of a horse with your own hands. Press play and watch it trundle off to reach the goal on the other side of the island. With 40+ levels and infinite solutions, it's a VR experience you and your friends will play for hours.",
    producer: 'Northway Productions',
    releaseDate: '2008'
  }),
    new Game({
    imagePath: 'http://cdn.ndtv.com/tech/images/gadgets/oculus_henry.jpg',
    title: 'Henry',
    description: "Meet Henry, the endearing star of Oculus Story Studio's second movie. It's Henry's birthday, but where are his friends? The new movie from Oculus Story Studio takes you inside the world of a lonesome but lovable hedgehog.",
    producer: 'Oculus Story Studio',
    releaseDate: '2016'
  }),
    new Game({
    imagePath: 'https://cdn2.vox-cdn.com/uploads/chorus_asset/file/3745620/Irrational_Exuberance_-_Unmake.0.jpg',
    title: 'Irrational Exuberance',
    description: "Journey to imaginary worlds as a lone explorer in deep space. Designed for the HTC Vive, Irrational Exuberance transports you to beautiful, mysterious, and incredible worlds. As you change stunning, surreal landscapes, will you discover the secrets binding the universe together?",
    producer: 'Buffalo Vision',
    releaseDate: '6 May 2016'
  })
]
var done = 0;
for (var i = 0; i < games.length; i++) {
  games[i].save(function(err, result) {
    done++;
    if (done === games.length) {
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}
