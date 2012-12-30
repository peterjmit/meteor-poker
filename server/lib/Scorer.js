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
  HAND_TYPES = [
    'invalid hand',
    'high card',
    'one pair',
    'two pairs',
    'three of a kind',
    'straight',
    'flush',
    'full house',
    'four of a kind',
    'straight flush'
  ];

var Scorer = function(options) {
  options = options || {};

  this.ranks = ranks;
};

_.extend(Scorer.prototype, {
  scoreTable: function(table) {
    // original 5 table cards
    var tableCards = _.clone(table.flop);
    tableCards.push(_.clone(table.turn), _.clone(table.river));

    _.each(table.seats, function (seat, idx) {
      table.seats[idx] = this.scoreSeat(seat, tableCards);
    }, this);

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
      name: HAND_TYPES[score >> 12],
      value: score,
      category: score >> 12,
      rankWithinCategory: score & 0x00000fff
    };
  },

  scoreCard: function(card) {
    return this.ranks.readUInt32LE(card * 4);
  }
});
