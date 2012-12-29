Session.set('active_table_id', null);
Session.set('active_hand_id', null);

// Always be subscribed to the table a user has selected
Meteor.autosubscribe(function () {
  var tableId = Session.get('active_table_id');

  if (tableId) {
    Meteor.subscribe('activeTable', tableId);
  }
});

var AppRouter = Backbone.Router.extend({
  routes: {
    '': 'index',
    'table/:list_id': 'table'
  },

  index: function() {
    Session.set('active_table_id', null);
  },

  table: function (tableId) {
    Session.set('active_table_id', tableId);
  }
});

Router = new AppRouter();

Meteor.startup(function () {
  Backbone.history.start({ pushState: true });
});
