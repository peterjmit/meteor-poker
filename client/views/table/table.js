var deck = function(method, callback) {
  var tableId = Session.get('active_table_id');

  Meteor.call(method, tableId, callback);
};

Template.table.events({
  'click .deal': function(evt) {
    var $button = $(evt.target);
    // var $message = $('.message');

    if ($button.hasClass('disabled')) {
      return;
    }

    $button.addClass('disabled');

    deck('deal', function(error, response) {
      console.log(arguments);
      // var card = response.card || null;

      // if (error || ! response || ! card) {
      //   console.log(error);
      //   return;
      // }

      // console.log(response.meta);

      // var $card = $('<span />')
      //   .addClass('card')
      //   // .attr('src', card.getImgSrc())
      //   .addClass(card.suit)
      //   .addClass(card.value);

      // $('.table-cards').append($card);

      $button.removeClass('disabled');
    });
  },

  'click .new-hand': function(evt) {
    $button = $(evt.target);

    if ($button.hasClass('disabled')) {
      return;
    }

    $button.addClass('disabled');

    deck('resetTable', function() {
      // remove any cards
      $('.card').remove();
      $('.table-cards').empty();
      $('.deal').removeClass('disabled');
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

Template.table.hand_complete = function() {
  return false;
};
