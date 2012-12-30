// the dealer's role is to manage the presence of cards
// on the table, it will always return the table so it can be
// persisted
var Dealer = function(options) {
  options = options || {};

  this.tableId = options.tableId;
  this.deck = options.deck;

  this.PRE_FLOP = 'pre-flop';
  this.FLOP = 'flop';
  this.TURN = 'turn';
  this.RIVER = 'river';
  this.ROUND_COMPLETE = 'round-complete';
};

_.extend(Dealer.prototype, {
  deal: function(table) {
    this.table = table;

    var stage = this.getNextAction(table);

    switch (stage) {
      case this.PRE_FLOP:
        this.dealPreFlop();
        break;

      case this.FLOP:
        this.dealFlop();
        break;

      case this.TURN:
        this.dealTurn();
        break;

      case this.RIVER:
        this.dealRiver();
        break;

      case this.ROUND_COMPLETE:
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
      seat.score = {};
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

  getNextAction: function(table) {
    var
      seats = table.seats || [],
      flop = table.flop || [],
      turn = table.turn || {},
      river = table.river || {};
      isPreFlop = _.every(seats, function (seat) {
        return seat.playerId && seat.hand.length === 0;
      });

    if (isPreFlop) {
      return this.PRE_FLOP;
    }

    if ( ! isPreFlop && flop.length === 0 && _.isEmpty(turn) && _.isEmpty(river)) {
      return this.FLOP;
    }

    if ( ! isPreFlop && flop.length > 0 && _.isEmpty(turn) && _.isEmpty(river)) {
      return this.TURN;
    }

    if ( ! isPreFlop && flop.length > 0 &&  ! _.isEmpty(turn) && _.isEmpty(river)) {
      return this.RIVER;
    }

    if ( ! isPreFlop && flop.length > 0 && ! _.isEmpty(turn) && ! _.isEmpty(river)) {
      return this.ROUND_COMPLETE;
    }

    throw Meteor.Error(400, 'Table is in an unknown state');
  }
});
