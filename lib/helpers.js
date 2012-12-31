var isPlayerOnTable = function(table) {
  var userId = Meteor.userId(),
    isPlayerOnTable = false;

  _.each(table.seats, function (seat) {
    if (userId === seat.userId) {
      isPlayerOnTable = true;
      return;
    }
  });

  return isPlayerOnTable;
};
