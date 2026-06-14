const io = require('socket.io-client');
const socket = io('http://localhost:3000');

socket.on('connect', () => {
    console.log('Connected');
    socket.emit('join_game', { gameType: 'tictactoe', roomId: 'TESTX' });
});

socket.on('joined', (data) => {
    console.log('Joined as', data.symbol);
    if (data.symbol === 'player1') {
        // Now simulate player 2
        const p2 = io('http://localhost:3000');
        p2.on('connect', () => {
            p2.emit('join_game', { gameType: 'tictactoe', roomId: 'TESTX' });
        });
        p2.on('joined', d => console.log('P2 joined as', d.symbol));
        p2.on('game_start', () => console.log('P2 game_start'));
    }
});

socket.on('game_start', () => {
    console.log('P1 game_start');
    process.exit(0);
});
