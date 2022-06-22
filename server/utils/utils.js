// const { v4: generateUuid } = require('uuid');

let usedRoomCodes = [];

const generateFourLetterCode = () => {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (var i = 0; i < 4; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

const generateRoomCode = () => {
  let text = generateFourLetterCode();
  while(usedRoomCodes.indexOf(text) > -1) {
    text = generateFourLetterCode();
  }
  usedRoomCodes.push(text);
  return text;
}

const generateNewRoomData = () => {
  return {
    timestamp: new Date(),
    // gameUuid: generateUuid(),
    roomCode: generateRoomCode(),
    pending: [],
    transactions: [],
    balanceTotal: 0,
    buyInTotal: 0,
    cashOutTotal: 0,
    physicalCash: 0,
    players: {},
    payments: []
  }
}

const generateNewTimestamp = () => {
  return new Date();
}

const createPlayer = ({venmoId, displayName, fbId}) => {
  return {
    joinTime: new Date(),
    // playerUuid: '',
    venmoId: venmoId || '',
    displayName: displayName || '',
    fbId: fbId || '',
    buyInTotal: 0,
    cashOutTotal: 0,
    endBalance: 0,
    recentTransaction: {},
    isSettled: false,
    payments: []
  }
}

const addPlayerToRoom = ({room, venmoId, displayName, fbId}) => {
  let player = createPlayer({venmoId, displayName, fbId});
  room.players[venmoId] = Object.assign({}, player);

  return room;
}

const createTransaction = ({player, amount, transactionType, isCash = false}) => {
  return {
    timestamp: new Date(),
    player,
    amount,
    transactionType,
    isCash,
    approved: false
  }
}

const addTransactionToRoom = ({room, player, amount, transactionType, isCash}) => {
  let transaction = createTransaction({player, amount, transactionType, isCash});
  room.pending = room.pending.slice(0).push(transaction);

  return room;
}

module.exports = {
  generateNewTimestamp,
  generateNewRoomData,
  addPlayerToRoom,
  addTransactionToRoom
}