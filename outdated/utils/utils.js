import deepClone from 'lodash/cloneDeep';
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
    amount: Number(amount),
    transactionType,
    isCash: Boolean(isCash),
    approved: false
  }
}

const addTransactionToRoom = ({room, player, amount, transactionType, isCash}) => {
  let transaction = createTransaction({player, amount, transactionType, isCash});
  room.pending = room.pending.slice(0);
  room.pending.push(transaction);

  return room;
}

const confirmTransaction = ({room, transactionIndex, approve}) => {
  let newRoom = deepClone(room);
  let {
    pending,
    denied,
    transactions,
    players,
    balanceTotal,
    cashOutTotal,
    buyInTotal,
    physicalCash
  } = newRoom;
  let transaction = pending.splice(transactionIndex, 1);
  let { player, amount, transactionType, isCash, approved } = transaction;

  if (approve) {
    let { buyInTotal, cashOutTotal, recentTransaction, isSettled, endBalance } = player;

    if (transactionType === 'BUYIN') {
      buyInTotal = buyInTotal + amount;
    }
    if (transactionType === 'CASHOUT') {
      cashOutTotal = cashOutTotal + amount;
    }

    approved = true;
    recentTransaction.push(transaction);
    transactions.push(transaction);
  } else {
    denied.push(transaction);
  }

  return Object.assign({}, room, {
    pending,
    denied,
  });
};

module.exports = {
  generateNewTimestamp,
  generateNewRoomData,
  addPlayerToRoom,
  addTransactionToRoom,
  confirmTransaction
}