Template.lobby.tables = function() {
  return Tables.find();
};

Template.lobby.any_table_selected = function() {
  return ! Session.equals('active_table_id', null);
};

Template.lobby.events({
  'click .tables li': function (evt) {
    var tableId = $(evt.target).parents('li').data('tableId');

    Router.navigate('table/' + tableId, true);
  }
});
