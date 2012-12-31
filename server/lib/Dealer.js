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

    this.collectBets();

    return this.table;
  },

  collectBets: function() {
    _.each(this.table.seats, function (seat, idx) {
      this.table.pot += parseInt(seat.bet || 0, 10);
      this.table.seats[idx].bet = null;
    }, this);
  },

  dealPreFlop: function() {
    // deal first card to players
    this.dealToPlayers();

    // deal second card to players
    this.dealToPlayers();
  },

  dealToPlayers: function() {
    _.each(this.table.seats, function (seat) {
      if ( ! seat.userId) return;

      // seat.hand = seat.hand || [];

      seat.hand.push(this.dealCard());
    }, this);
  },

  dealFlop: function() {
    this.table.cards = [
      this.dealCard(),
      this.dealCard(),
      this.dealCard()
    ];
  },

  dealTurn: function(table) {
    this.table.cards.push(this.dealCard());
  },

  dealRiver: function(table) {
    this.table.cards.push(this.dealCard());
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
      seat.bet = null;
      seat.folded = false;
    });

    table.cards = [];
    table.pot = 0;

    this.shuffle();

    return table;
  },

  shuffle: function() {
    this.deck.shuffle();
  },

  getNextAction: function(table) {
    var
      seats = table.seats || [],
      cards = table.cards || [],
      isPreFlop = _.every(seats, function (seat) {
        return seat.userId && seat.hand.length === 0;
      });

    if (isPreFlop) {
      return this.PRE_FLOP;
    }

    if ( ! isPreFlop && cards.length === 0) {
      return this.FLOP;
    }

    if ( ! isPreFlop && cards.length === 3) {
      return this.TURN;
    }

    if ( ! isPreFlop && cards.length === 4) {
      return this.RIVER;
    }

    if ( ! isPreFlop && cards.length === 5) {
      return this.ROUND_COMPLETE;
    }

    throw Meteor.Error(400, 'Table is in an unknown state');
  }
});
