const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { 
  generateNewTimestamp,
  generateNewRoomData,
  addPlayerToRoom,
  addTransactionToRoom
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

app.get('/api/getRoom', (req, res) =>{
  let { roomCode = '' } = req.query;
  res.send(state.games[roomCode])
})

app.get('/api/createRoom', (req, res) => {
  let room = generateNewRoomData();
  let { roomCode } = room;
  state.games[roomCode] = room;
  res.send(state.games[roomCode]);
});

app.get('/api/createPlayer', (req, res) => {
  // let { roomCode } = req.body.data;
  let { roomCode, venmoId } = req.query;
  let room = state.games[roomCode];
  state.games[roomCode] = addPlayerToRoom({room, venmoId});
  res.send(state.games[roomCode]);
});

app.get('/api/createTransaction', (req, res) => {
  // let { roomCode, player, amount, transactionType } = req.body.data
  let { roomCode, player, amount, transactionType, isCash } = req.query;
  let room = state.games[roomCode];
  state.games[roomCode] = addTransactionToRoom({
    room, player, amount, transactionType, isCash
  });
  res.send(state.games[roomCode]);
});

app.get('/api/confirmTransaction', (req, res) => {

});

app.listen(PORT, () => {
  console.log(`Poker Payer running on port ${PORT}`);
});
