# Skill: Socket.io Multiplayer Room Architecture

## Overview

TinyGames uses Socket.io for real-time 2-player games. The pattern is:
- Room-based matchmaking (6-character room code)
- QR code room sharing
- Local 2-player mode as fallback
- Server handles move relay only (no server-side game logic)

---

## Backend: server.js Pattern

```javascript
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

// Game rooms registry
const games = {
  tictactoe: {},
  dotsandboxes: {},
  pallanguzhi: {},
  aadupuliaattam: {},
  // Add new multiplayer games here
};

io.on('connection', (socket) => {
  console.log('Connected:', socket.id);

  // JOINING A ROOM
  socket.on('join_game', (data) => {
    const { gameType, roomId } = data;
    socket.join(roomId);
    
    if (!games[gameType][roomId]) {
      games[gameType][roomId] = { 
        players: [], 
        state: null,
        gridSize: data.gridSize || 6  // Optional config
      };
    }
    
    const room = games[gameType][roomId];
    
    if (room.players.length < 2) {
      room.players.push(socket.id);
      const role = room.players.length === 1 ? 'player1' : 'player2';
      
      socket.emit('joined', { role, roomId });
      
      if (room.players.length === 2) {
        io.to(roomId).emit('game_start', { 
          message: 'Game starts!', 
          gridSize: room.gridSize 
        });
      }
    } else {
      socket.emit('error', 'Room is full');
    }
  });

  // MOVE RELAY (server doesn't validate moves, just relays)
  socket.on('make_move', (data) => {
    const { roomId, move, gameType } = data;
    socket.to(roomId).emit('opponent_move', move);
  });
  
  // GAME RESET
  socket.on('reset_game', (data) => {
    const { roomId } = data;
    io.to(roomId).emit('reset_game');
  });

  // DISCONNECT HANDLING
  socket.on('disconnect', () => {
    for (const gameType in games) {
      for (const roomId in games[gameType]) {
        const room = games[gameType][roomId];
        const idx = room.players.indexOf(socket.id);
        if (idx !== -1) {
          room.players.splice(idx, 1);
          if (room.players.length === 0) {
            delete games[gameType][roomId];
          } else {
            io.to(roomId).emit('error', 'Opponent disconnected.');
          }
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server on port ${PORT}`));
```

---

## Frontend: Room Management Pattern

### Room Code Generation
```javascript
function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase(); // e.g. "K7XMN2"
}
```

### Room Join Flow
```javascript
const socket = io();
let myRole = null;
let roomId = null;

// CREATE a room
document.getElementById('create-room-btn').addEventListener('click', () => {
  roomId = generateRoomCode();
  socket.emit('join_game', { gameType: 'mygame', roomId });
  showWaitingState(roomId);
});

// JOIN a room
document.getElementById('join-room-btn').addEventListener('click', () => {
  roomId = document.getElementById('room-code-input').value.trim().toUpperCase();
  if (roomId.length === 6) {
    socket.emit('join_game', { gameType: 'mygame', roomId });
  }
});

// Server responses
socket.on('joined', ({ role }) => {
  myRole = role;
  if (role === 'player1') {
    // Show room code + QR code, wait for player 2
    showRoomInfo(roomId);
  }
});

socket.on('game_start', () => {
  hideWaiting();
  startGameUI();
});

socket.on('opponent_move', (move) => {
  applyOpponentMove(move);
});

socket.on('error', (msg) => {
  alert(msg);
});
```

---

## QR Code Room Sharing

Include QRCode.js from CDN:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
```

Generate QR that pre-fills the room code:
```javascript
function showRoomInfo(roomId) {
  document.getElementById('display-room-code').textContent = roomId;
  
  // Build URL that auto-joins
  const joinUrl = `${window.location.origin}${window.location.pathname}?room=${roomId}`;
  
  new QRCode(document.getElementById('qrcode'), {
    text: joinUrl,
    width: 160,
    height: 160,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.M
  });
  
  document.getElementById('room-info').classList.remove('hidden');
}
```

Auto-join from QR URL:
```javascript
// At page load, check URL params
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const roomFromUrl = params.get('room');
  if (roomFromUrl) {
    document.getElementById('room-code-input').value = roomFromUrl;
    // Optionally auto-join
  }
});
```

---

## Local 2-Player Mode (No Server)

For offline/local play on same device:

```javascript
let localMode = false;
let localCurrentPlayer = 'player1';

document.getElementById('local-mode-btn').addEventListener('click', () => {
  localMode = true;
  myRole = 'player1'; // Start as player 1
  startGameUI();
});

function makeMove(move) {
  if (localMode) {
    applyMove(move, localCurrentPlayer);
    localCurrentPlayer = localCurrentPlayer === 'player1' ? 'player2' : 'player1';
  } else {
    // Online: emit to server
    socket.emit('make_move', { roomId, move, gameType: 'mygame' });
    applyMove(move, myRole);
  }
}
```

---

## Turn Validation Pattern

```javascript
function isMyTurn() {
  if (localMode) return true; // Both players local
  return currentTurn === myRole;
}

function handleCellClick(cellIndex) {
  if (!isMyTurn()) return; // Ignore if not my turn
  if (board[cellIndex] !== null) return; // Already filled
  
  const move = { cellIndex, player: myRole };
  makeMove(move);
}
```

---

## Socket.io Script Include

For HuggingFace/local server, Socket.io is served by the Node backend:
```html
<script src="/socket.io/socket.io.js"></script>
```

> Do NOT use the CDN version — must match server version exactly.

---

## Event Reference

| Event (Client → Server) | Payload | Description |
|-------------------------|---------|-------------|
| `join_game` | `{gameType, roomId, ...config}` | Join or create room |
| `make_move` | `{roomId, gameType, move}` | Relay a move |
| `reset_game` | `{roomId, gameType}` | Reset for both players |

| Event (Server → Client) | Payload | Description |
|-------------------------|---------|-------------|
| `joined` | `{role, roomId}` | Assigned role (player1/player2) |
| `game_start` | `{message, ...config}` | Both players connected |
| `opponent_move` | `move` | Opponent's move data |
| `reset_game` | — | Game was reset |
| `error` | `message string` | Error message |
