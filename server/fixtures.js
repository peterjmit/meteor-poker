Meteor.startup(function () {
  if (Tables.find().count() === 0) {
    console.log('inserting tables');
    Tables.insert({
      name: 'Table 1',
      cards: [],
      maxSeats: 6,
      seats: [
      ]
    });
  }
});
