var
  require = __meteor_bootstrap__.require,
  path = require('path'),
  ranksFile = path.resolve('HandRanks.dat'),
  fs = require('fs'),
  ranks = fs.readFileSync(ranksFile),
  CARDS = {
    '2C': 1,
    '2D': 2,
    '2H': 3,
    '2S': 4,
    '3C': 5,
    '3D': 6,
    '3H': 7,
    '3S': 8,
    '4C': 9,
    '4D': 10,
    '4H': 11,
    '4S': 12,
    '5C': 13,
    '5D': 14,
    '5H': 15,
    '5S': 16,
    '6C': 17,
    '6D': 18,
    '6H': 19,
    '6S': 20,
    '7C': 21,
    '7D': 22,
    '7H': 23,
    '7S': 24,
    '8C': 25,
    '8D': 26,
    '8H': 27,
    '8S': 28,
    '9C': 29,
    '9D': 30,
    '9H': 31,
    '9S': 32,
    'TC': 33,
    'TD': 34,
    'TH': 35,
    'TS': 36,
    'JC': 37,
    'JD': 38,
    'JH': 39,
    'JS': 40,
    'QC': 41,
    'QD': 42,
    'QH': 43,
    'QS': 44,
    'KC': 45,
    'KD': 46,
    'KH': 47,
    'KS': 48,
    'AC': 49,
    'AD': 50,
    'AH': 51,
    'AS': 52
  },
  HAND_CATEGORIES = [
    'undefined',
    'High card',
    'One pair',
    'Two pairs',
    'Three of a kind',
    'Straight',
    'Flush',
    'Full house',
    'Four of a kind',
    'Straight flush'
  ];

var Scorer = function(options) {
  options = options || {};

  this.ranks = ranks;
};

_.extend(Scorer.prototype, {
  scoreTable: function(table) {
    _.each(table.seats, function (seat, idx) {
      seat = this.scoreSeat(seat, table.cards);
      seat.score.winner = false;
      table.seats[idx] = seat;
    }, this);

    // find the max score, and mark as winner
    _.max(table.seats, function (seat) {
      return seat.score.value;
    }).score.winner = true;

    return table;
  },

  scoreSeat: function(seat, tableCards) {
    var hand = _.pluck(seat.hand.concat(tableCards), 'id');

    seat.score = this.scoreHand(hand);

    return seat;
  },

  scoreHand: function(hand) {
    var score = _.reduce(hand, function (start, card) {
      return this.scoreCard(start + CARDS[card]);
    }, 53, this); // not sure why we start at 53

    return {
      name: HAND_CATEGORIES[score >> 12],
      value: score
    };
  },

  scoreCard: function(card) {
    return this.ranks.readUInt32LE(card * 4);
  }
});
