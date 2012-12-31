var tableManager = function(method, callback) {
  var tableId = Session.get('active_table_id');

  Meteor.call(method, tableId, callback);
};

Template.table.events({
  'click .leave-table': function(evt) {
    var tableId = Session.get('active_table_id');

    Meteor.call('leaveTable', tableId, this.userId);
  },

  'click .bet': function(evt) {
    var amount = $('.bet-value').val();

    tableManager('placeBet', amount, function() {

    });
  },

  'change .bet-value': function(evt) {
    $('.bet-value-display').html($('.bet-value').val());
  },

  'click .check': function(evt) {
    tableManager('placeBet', 0, function() {});
  }
});

Template.player.can_see_cards = function() {
  // anyone with a JS console will be able to see all cards on the table
  return Meteor.userId() == this.userId || ! _.isEmpty(this.score);
};

Template.player.show_betting_controls = function() {
  // not the current user
  if (Meteor.userId() !== this.userId ||
  // or has no cards, or bet has been placed
    this.hand.length === 0 || this.folded || this.bet !== null
  ) {
    return false;
  }

  return true;
};
