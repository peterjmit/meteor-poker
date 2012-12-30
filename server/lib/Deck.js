var
  CARD_VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'],
  SUITS = ['S', 'C', 'H', 'D'];

var cards = [];

// maps card values and suits to a full deck
_.each(SUITS, function (suit) {
  _.each(CARD_VALUES, function (value) {
    cards.push({ id: value + suit, value: value, suit: suit });
  });
});

var Card = Backbone.Model.extend({});

var Deck = Backbone.Collection.extend({
  model: Card,
  initialize: function() {
    // mix it up
    this.shuffle();
  },

  shuffle: function() {
    this.reset(cards);

    this.models = _.shuffle(this.models);
  },

  deal: function() {
    return this.shift();
  }
});
