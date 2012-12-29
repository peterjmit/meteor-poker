var
  PRE_FLOP = 'pre-flop',
  FLOP = 'flop',
  TURN = 'turn',
  RIVER = 'river',
  ROUND_COMPLETE = 'round-complete';

var
  cardValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
  suits = ['S', 'C', 'H', 'D'],
  cards = [];

// maps card values and suits to a full deck
_.each(suits, function (suit) {
  _.each(cardValues, function (value) {
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

// the dealer's role is to manage the presence of cards
// on the table, it will always return the table so it can be
// persisted
var Dealer = function(options) {
  options = options || {};

  this.tableId = options.tableId;
  this.deck = options.deck || new Deck();
};

_.extend(Dealer.prototype, {
  deal: function(table) {
    this.table = table;

    var stage = this.determineTableStage();

    switch (stage) {
      case PRE_FLOP:
        console.log('Dealing pre_flop');
        this.dealPreFlop();
        break;

      case FLOP:
        console.log('Dealing flop');
        this.dealFlop();
        break;

      case TURN:
        console.log('Dealing turn');
        this.dealTurn();
        break;

      case RIVER:
        console.log('Dealing river');
        this.dealRiver();
        break;

      case ROUND_COMPLETE:
        console.log('Dealing round_complete');
        break;
    }

    return this.table;
  },

  dealPreFlop: function() {
    // deal first card to players
    this.dealToPlayers();

    // deal second card to players
    this.dealToPlayers();
  },

  dealToPlayers: function() {
    _.each(this.table.seats, function (seat) {
      if ( ! seat.playerId) return;

      seat.hand.push(this.dealCard());
    }, this);
  },

  dealFlop: function() {
    this.table.flop = [];

    this.table.flop.push(this.dealCard());
    this.table.flop.push(this.dealCard());
    this.table.flop.push(this.dealCard());
  },

  dealTurn: function(table) {
    this.table.turn = this.dealCard();
  },

  dealRiver: function(table) {
    this.table.river = this.dealCard();
  },

  dealCard: function() {
    if (this.deck.length > 0) {
      return this.deck.deal().toJSON();
    }

    throw Meteor.Error(400, 'Dealer has run out of cards in his deck');
  },

  resetTable: function(table) {
    _.each(table.seats, function (seat) {
      seat.hand = [];
    });

    table.flop = [];
    table.turn = {};
    table.river = {};

    this.shuffle();

    return table;
  },

  shuffle: function() {
    this.deck.shuffle();
  },

  determineTableStage: function() {
    var
      seats = this.table.seats || [],
      flop = this.table.flop || [],
      turn = this.table.turn || {},
      river = this.table.river || {};
      isPreFlop = _.every(seats, function (seat) {
        return seat.playerId && seat.hand.length === 0;
      });

    if (isPreFlop) {
      return PRE_FLOP;
    }

    if ( ! isPreFlop && flop.length === 0 && _.isEmpty(turn) && _.isEmpty(river)) {
      return FLOP;
    }

    if ( ! isPreFlop && flop.length > 0 && _.isEmpty(turn) && _.isEmpty(river)) {
      return TURN;
    }

    if ( ! isPreFlop && flop.length > 0 &&  ! _.isEmpty(turn) && _.isEmpty(river)) {
      return RIVER;
    }

    if ( ! isPreFlop && flop.length > 0 && ! _.isEmpty(turn) && ! _.isEmpty(river)) {
      return ROUND_COMPLETE;
    }

    throw Meteor.Error(400, 'Table is in an unknown state');
  }
});

var dealers = {};

var getDealerForTable = function(tableId) {
  if ( ! _.has(dealers, tableId)) {
    dealers[tableId] = new Dealer({ tableId: tableId });
  }

  return dealers[tableId];
};

Meteor.methods({
  deal: function(tableId) {
    var table = Tables.findOne({ _id: tableId });
    var dealer = getDealerForTable(tableId);

    table = dealer.deal(table);

    console.log(table);
    // console.log(table.seats[0].hand);

    Tables.update({ _id: tableId }, table);
  },

  resetTable: function(tableId) {
    var table = Tables.findOne({ _id: tableId });
    var dealer = getDealerForTable(tableId);

    table = dealer.resetTable(table);

    console.log(table);

    Tables.update({ _id: tableId }, table);
  }
});
