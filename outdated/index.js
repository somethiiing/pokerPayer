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
  games: {
    ASDF: {
      "timestamp": "2022-06-24T09:47:53.136Z",
      "roomCode": "ASDF",
      "pending": [
        {
          "timestamp": "2022-06-24T10:01:24.288Z",
          "player": "testtest",
          "amount": 100,
          "transactionType": "BUYIN",
          "isCash": false,
          "approved": false
      },
      {
          "timestamp": "2022-06-24T10:01:32.047Z",
          "player": "testtest",
          "amount": 100,
          "transactionType": "BUYIN",
          "isCash": false,
          "approved": false
      },
      {
          "timestamp": "2022-06-24T10:05:39.602Z",
          "player": "testtest",
          "amount": 100,
          "transactionType": "BUYIN",
          "isCash": false,
          "approved": false
      }
      ],
      "transactions": [],
      "balanceTotal": 0,
      "buyInTotal": 0,
      "cashOutTotal": 0,
      "physicalCash": 0,
      "players": {
        "testtest": {
          "joinTime": "2022-06-24T09:50:14.893Z",
          "venmoId": "testtest",
          "displayName": "Fake User",
          "fbId": "",
          "buyInTotal": 0,
          "cashOutTotal": 0,
          "endBalance": 0,
          "recentTransaction": {},
          "isSettled": false,
          "payments": []
      },
      },
      "payments": []
    }
  }
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

app.post('/api/createRoom', (req, res) => {
  let room = generateNewRoomData();
  let { roomCode } = room;
  state.games[roomCode] = room;
  res.send(state.games[roomCode]);
});

app.post('/api/addPlayer', (req, res) => {
  console.log(req.body)
  let { roomCode, venmoId, displayName } = req.body;
  // let { roomCode, venmoId } = req.query;
  let room = state.games[roomCode];
  state.games[roomCode] = addPlayerToRoom({room, venmoId, displayName});
  res.send(state.games[roomCode]);
});

app.post('/api/addTransaction', (req, res) => {
  let { roomCode, player, amount, transactionType, isCash } = req.body
  // let { roomCode, player, amount, transactionType, isCash } = req.query;
  let room = state.games[roomCode];
  state.games[roomCode] = addTransactionToRoom({
    room, player, amount, transactionType, isCash
  });
  res.send(state.games[roomCode]);
});

app.post('/api/confirmTransaction', (req, res) => {
  let { roomCode, transactionIndex, approve } = req.body;
  
});

app.listen(PORT, () => {
  console.log(`Poker Payer running on port ${PORT}`);
});
