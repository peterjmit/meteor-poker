var dealer = function(method, callback) {
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

    dealer('deal', function (error, response) {
      if (response.tableStatus === 'round-complete') {
        // disable the score button and not the deal button!
        $('.score').removeClass('disabled');
        return;
      }

      $button.removeClass('disabled');
    });
  },

  'click .score': function(evt) {
    var $button = $(evt.target);

    if ($button.hasClass('disabled')) {
      return;
    }

    $button.addClass('disabled');

    dealer('scoreTable', function (error, response) {
      console.log(response);

      $button.removeClass('disabled');
    });
  },

  'click .new-hand': function(evt) {
    $button = $(evt.target);

    if ($button.hasClass('disabled')) {
      return;
    }

    $button.addClass('disabled');

    dealer('resetTable', function() {
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
  var tableId = Session.get('active_table_id');

  if( ! tableId) {
    return {};
  }

  return Tables.findOne({ _id: tableId });
};

Template.table.any_table_selected = function() {
  return ! Session.equals('active_table_id', null);
};
