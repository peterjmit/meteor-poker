var tableManager = function(method, callback) {
  var tableId = Session.get('active_table_id');

  Meteor.call(method, tableId, callback);
};

Template.table.events({
  'click .deal': function(evt) {
    var $button = $(evt.target);

    if ($button.hasClass('disabled')) {
      return;
    }

    $button.addClass('disabled');

    tableManager('deal', function (error, response) {
      if (response.tableStatus === 'round-complete') {
        // disable the score button and not the deal button!
        $('.score').removeClass('disabled');
        return;
      }

      $button.removeClass('disabled');
    });
  },

  'click .join-table': function(evt) {
    tableManager('joinTable', function (error, response) {

    });
  },

  'click .score': function(evt) {
    tableManager('scoreTable', function (error, response) {});
  },

  'click .new-hand': function(evt) {
    $button = $(evt.target);

    if ($button.hasClass('disabled')) {
      return;
    }

    $button.addClass('disabled');

    tableManager('resetTable', function() {
      // remove any cards
      $('.card').remove();
      $('.table-cards').empty();
      $('.deal').removeClass('disabled');
      $('.score').addClass('disabled');
      $button.removeClass('disabled');
    });
  }
});

Template.table.table = function() {
  return Tables.findOne({ _id: Session.get('active_table_id') });
};

Template.table.active_bets = function() {
  var table = Tables.findOne({ _id: Session.get('active_table_id') });

  return _.reduce(table.seats, function(start, seat) {
    return parseInt(seat.bet || 0, 10) + start;
  }, 0);
}

Template.table.any_table_selected = function() {
  if (Session.equals('active_table_id', null)) {
    return false;
  }

  if( ! Tables.findOne({ _id: Session.get('active_table_id') })) {
    return false;
  }

  return true;
};

Template.table.seat_available = function () {
  var tableId = Session.get('active_table_id'),
    userId = Meteor.userId(),
    playerOnTable = false;

  if( ! tableId || ! userId) {
    return false;
  }

  table = Tables.findOne({ _id: tableId });

  if( ! table) {
    return false;
  }

  if (table.seats === table.maxSeats || isPlayerOnTable(table)) {
    return false;
  }

  return true;
};
