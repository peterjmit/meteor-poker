var isPlayerOnTable = function(table, userId) {
  var isPlayerOnTable = false;

  _.each(table.seats, function (seat) {
    if (userId === seat.userId) {
      isPlayerOnTable = true;
      return;
    }
  });

  return isPlayerOnTable;
};
