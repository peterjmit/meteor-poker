var
  dealers = {},
  scorer = new Scorer();

var getDealerForTable = function(tableId) {
  if ( ! _.has(dealers, tableId)) {
    dealers[tableId] = new Dealer({ tableId: tableId, deck: new Deck() });
  }

  return dealers[tableId];
};

var deal = function(tableId) {
  var table = Tables.findOne({ _id: tableId }),
    dealer = getDealerForTable(tableId);

  table = dealer.deal(table);

  Tables.update({ _id: tableId }, {
    $set: {
      cards: table.cards,
      seats: table.seats,
      pot: table.pot
    }
  });

  return dealer.getNextAction(table);
};

Meteor.methods({
  deal: deal,

  placeBet: function(tableId, amount) {
    var table, playersStillToBet, round,
      // dealer = getDealerForTable(tableId),
      user = Meteor.user();

    // check if player is eligible to bet

    // update next player to go

    // deduct amount from players account

    // update table with bet amount
    Tables.update({ _id: tableId, 'seats.userId':  user._id }, {
      $set: {
        'seats.$.bet': amount
      }
    });

    table = Tables.findOne({ _id: tableId });

    playersStillToBet = _.find(table.seats, function(seat) {
      return seat.bet === null;
    });


    // finally deal if everyone has bet
    if (playersStillToBet) {
      return;
    }

    round = deal(tableId);

    console.log(round);
  },

  scoreTable: function(tableId) {
    var table = Tables.findOne({ _id: tableId }),
      dealer = getDealerForTable(tableId);

    if (dealer.getNextAction(table) !== dealer.ROUND_COMPLETE) {
      throw new Meteor.Error(400, 'Table not ready to be scored');
    }

    table = scorer.scoreTable(table);

    // should also distribute money!

    Tables.update({ _id: tableId }, {
      $set: { seats: table.seats }
    });
  },

  joinTable: function(tableId) {
    var table = Tables.findOne({ _id: tableId }),
      user = Meteor.user();

    if ( ! table || isPlayerOnTable(table) || ! user) {
      throw new Meteor.Error(400, 'Join table failed: Invalid table, player already on table or no active user');
    }

    // add user into table
    Tables.update({ _id: tableId }, {
      $push: {
        seats: {
          userId: user._id,
          name: user.username,
          hand: [],
          bet: 0
        }
      }
    });
  },

  leaveTable: function(tableId, userId) {
    var table = Tables.findOne({ _id: tableId });

    userId = userId || Meteor.userId();

    if ( ! table || ! isPlayerOnTable(table) || ! userId) {
      throw new Meteor.Error(400, 'Join table failed: Invalid table, player already on table or no active user');
    }

    // remove user from table
    Tables.update({ _id: tableId }, {
      $pull: {
        seats: { userId: userId }
      }
    });
  },

  resetTable: function(tableId) {
    var table = Tables.findOne({ _id: tableId }),
      dealer = getDealerForTable(tableId);

    table = dealer.resetTable(table);

    Tables.update({ _id: tableId }, table);
  }
});
