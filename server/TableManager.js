var
  dealers = {},
  scorer = new Scorer();

var getDealerForTable = function(tableId) {
  if ( ! _.has(dealers, tableId)) {
    dealers[tableId] = new Dealer({ tableId: tableId, deck: new Deck() });
  }

  return dealers[tableId];
};

Meteor.methods({
  deal: function(tableId) {
    var table = Tables.findOne({ _id: tableId });
    var dealer = getDealerForTable(tableId);

    table = dealer.deal(table);

    Tables.update({ _id: tableId }, table);

    return {
      tableStatus: dealer.getNextAction(table)
    };
  },

  scoreTable: function(tableId) {
    var table = Tables.findOne({ _id: tableId });
    var dealer = getDealerForTable(tableId);

    if (dealer.getNextAction(table) !== dealer.ROUND_COMPLETE) {
      throw Meteor.Error(400, 'Table not ready to be scored');
    }

    table = scorer.scoreTable(table);

    Tables.update({ _id: tableId }, table);
  },

  resetTable: function(tableId) {
    var table = Tables.findOne({ _id: tableId });
    var dealer = getDealerForTable(tableId);

    table = dealer.resetTable(table);

    Tables.update({ _id: tableId }, table);
  }
});
