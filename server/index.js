const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { 
  generateNewTimestamp,
  generateNewRoomData,
  addPlayerToRoom
} = require('./utils/utils');



const app = express();
const PORT = process.env.PORT||5000

const state = {
  timestamp: new Date(),
  games: {}
};

app
  .use(cors())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use((req, res, next) => {
    state.timestamp = generateNewTimestamp();
    console.log('new timestamp: ', state.timestamp)
    next();
  })
  // .use(express.static(path.join(__dirname, '../build')));

app.get('/api/', (req, res) => {
  res.send(state);
});

app.get('/api/createRoom', (req, res) => {
  let room = generateNewRoomData();
  let { gameCode } = room;
  state.games[gameCode] = room;
  res.send({roomState: state.games[gameCode]});
});

app.get('/api/createPlayer', (req, res) => {
  // let { room } = req.body.data;
  let { roomCode, venmoId } = req.query;
  let room = state.games[roomCode];
  let updatedRoom = addPlayerToRoom({room, venmoId});
  state.games[roomCode] = updatedRoom;
  res.send({roomState: state.games[roomCode]});
});

app.listen(PORT, () => {
  console.log(`Poker Payer running on port ${PORT}`);
});
