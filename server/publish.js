Meteor.publish('tables', function () {
  return Tables.find();
});

// Publish all items for requested list_id.
Meteor.publish('activeTable', function (id) {
  return Tables.findOne({ _id: id });
});

Meteor.startup(function () {

  Tables.allow({
    insert: function(userId, doc) {
      return true;
    },
    update: function(userId, docs, fields, modifier) {
      return false;
    },
    remove: function(userId, docs) {
      return false;
    }
  });

});

