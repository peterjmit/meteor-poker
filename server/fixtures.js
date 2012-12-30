Meteor.startup(function () {
  if (Tables.find().count() === 0) {
    console.log('inserting tables');
    Tables.insert({
      name: 'Table 1',
      flop: [],
      turn: {},
      river: {},
      seats: [
        // { playerId: int, name: string, hand: { id: 'KD', value: 'K', suit: 'D' } }
        // { playerId: 1, name: 'Player 1', hand: [ { id: 'KD', value: 'K', suit: 'D' }, { id: 'KS', value: 'K', suit: 'S' } ] },
        // { playerId: 2, name: 'Player 2', hand: [ { id: '2H', value: '2', suit: 'H' }, { id: '7C', value: '7', suit: 'C' } ] },
        // { playerId: 3, name: 'Player 3', hand: [ { id: 'AH', value: 'A', suit: 'H' }, { id: 'AD', value: 'A', suit: 'D' } ] },
        // { playerId: 4, name: 'Player 4', hand: [ { id: '8C', value: '8', suit: 'C' }, { id: '9C', value: '9', suit: 'C' } ] },
        { playerId: 1, name: 'Player 1', hand: [] },
        { playerId: 2, name: 'Player 2', hand: [] },
        { playerId: 3, name: 'Player 3', hand: [] },
        { playerId: 4, name: 'Player 4', hand: [] }
      ]
    });
  }
});
