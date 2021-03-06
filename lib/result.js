var moment = require('moment');
var Promise = require('promise');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var elo = require('./elo');
var Player = require('./player');

var resultSchema = Schema({
  winnerId: Schema.Types.ObjectId,
  winnerName: String,
  loserId: Schema.Types.ObjectId,
  loserName: String,
  date: {
    type: Date,
    default: Date.now,
    index: true
  }
});

resultSchema.set('toObject', {
  transform: function(result, ret, options) {
    ret.id = result._id;
    ret.winner = result.winnerName;
    ret.loser = result.loserName;
    ret.date = moment(result.date).format('MMM D YYYY');
  }
});

resultSchema.statics.recent = function(options) {
  options = options || {};

  var query = this.find();
  query.sort({
    date: -1
  });

  if ('limit' in options) {
    query.limit(options.limit);
  }

  return query.exec();
};

resultSchema.statics.record = function(winner, loser) {
  if (winner.equals(loser)) {
    return Promise.reject(new Error('player cannot play themself'));
  }

  var newElos = elo(winner, loser);

  var eloChanges = {
    winner: {
      name: winner.name,
      oldElo: winner.elo,
      newElo: newElos.winner,
      eloDelta: '+' + (newElos.winner - winner.elo)
    },
    loser: {
      name: loser.name,
      oldElo: loser.elo,
      newElo: newElos.loser,
      eloDelta: newElos.loser - loser.elo
    }
  };

  // actually update players
  winner.elo = newElos.winner;
  winner.won();

  loser.elo = newElos.loser;
  loser.lost();

  var result = {
    winnerId: winner._id,
    winnerName: winner.name,
    loserId: loser._id,
    loserName: loser.name
  };

  return Promise.all([
    this.create(result),
    winner.save(),
    loser.save()
  ]).then(function() {
    return Player.rank();
  }).then(function() {
    return eloChanges;
  });
};

module.exports = mongoose.model('Result', resultSchema);