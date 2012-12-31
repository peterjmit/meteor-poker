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
  }

});

Template.player.can_see_cards = function() {
  return Meteor.userId() == this.userId || ! _.isEmpty(this.score);
};

Template.player.show_betting_controls = function() {
  if (Meteor.userId() !== this.userId || this.hand.length === 0 || this.folded || this.bet > 0) {
    return false;
  }

  return true;
};
