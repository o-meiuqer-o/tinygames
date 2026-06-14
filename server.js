const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

// Simple matchmaking logic
const games = {
    tictactoe: {},
    dotsandboxes: {},
    pallanguzhi: {},
    aadupuliaattam: {}
};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join_game', (data) => {
        console.log(`[DEBUG] Received join_game from ${socket.id} with data:`, data);
        const { gameType, roomId } = data;
        
        if (!gameType || !roomId) {
            console.error(`[DEBUG] Invalid join_game payload!`, data);
            return;
        }

        socket.join(roomId);
        
        if (!games[gameType]) {
            console.error(`[DEBUG] gameType ${gameType} does not exist in games object!`);
            return;
        }

        if (!games[gameType][roomId]) {
            games[gameType][roomId] = { players: [], state: null, gridSize: data.gridSize || 6 };
        }
        
        const room = games[gameType][roomId];
        
        if (room.players.length < 2) {
            room.players.push(socket.id);
            const symbol = room.players.length === 1 ? 'player1' : 'player2';
            
            socket.emit('joined', { symbol, roomId });
            console.log(`${socket.id} joined ${gameType} room ${roomId} as ${symbol}`);
            
            if (room.players.length === 2) {
                io.to(roomId).emit('game_start', { message: 'Both players connected. Game starts!', gridSize: room.gridSize });
            }
        } else {
            socket.emit('error', 'Room is full');
        }
    });

    socket.on('make_move', (data) => {
        const { roomId, move, gameType } = data;
        // Broadcast the move to the other player in the room
        socket.to(roomId).emit('opponent_move', move);
    });
    
    socket.on('reset_game', (data) => {
        const { roomId, gameType } = data;
        io.to(roomId).emit('reset_game');
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        
        // Find which room the user was in
        for (const gameType in games) {
            for (const roomId in games[gameType]) {
                const room = games[gameType][roomId];
                const index = room.players.indexOf(socket.id);
                if (index !== -1) {
                    room.players.splice(index, 1);
                    console.log(`Removed ${socket.id} from ${gameType} room ${roomId}`);
                    
                    // If room is empty, delete it
                    if (room.players.length === 0) {
                        delete games[gameType][roomId];
                        console.log(`Deleted empty room ${roomId} in ${gameType}`);
                    } else {
                        // Notify remaining player
                        io.to(roomId).emit('error', 'Opponent disconnected.');
                    }
                }
            }
        }
    });
});

const PORT = process.env.PORT || 3001;
http.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
