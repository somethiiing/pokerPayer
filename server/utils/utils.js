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

const createPayment = ({sender, receiver, payment, isCash}) => {
  //add a log here for each payment being created
  return {
    sender,
    receiver,
    payment,
    isCash
  }
}

const getListofPayments = ({players}) => {
  let payments = [];
  let receivers = [];
  let senders = [];

  // iterate through players list, sort by receivers (positive balance) and senders (negative balance, senders will have +ve number in their end balance afterwards)
  for(const player of players) {
    if (player.endBalance < 0) {
      player.endBalance *= -1;
      senders.push(player);
    } else {
      receivers.push(player);
    }
  }
  // sort senders and receivers list from greatest to smallest
  senders.sort(func(a,b){return a.endBalance > b.endBalance});
  receivers.sort(func(a,b){return a.endBalance > b.endBalance});

  var receiver = receivers.pop();
  var sender = senders.pop();
  while(sender != null) {
    if(sender.endBalance < receiver.endBalance) {
      payments.push(createPayment(sender.displayName, receiver.displayName, sender.endBalance, false));
      receiver.endBalance = receiver.endBalance - sender.endBalance;
      if (senders.length > 0) {
        sender = senders.pop();
      }
    } else if (sender.endBalance > receiver.endBalance) {
      payments.push(createPayment(sender.displayName, receiver.displayName, receiver.endBalance, false));
      sender.endBalance = sender.endBalance - receiver.endBalance
      receiver = receivers.pop();
    } else {  //sender and receiver balance are equal
      payments.push(createPayment(sender.displayName, receiver.displayName, receiver.endBalance, false));
      if (senders.length == 0) {
        sender = null
      } else {
        sender = senders.pop()
        receiver = receivers.pop()
      }
    }
  }

  return payments;
}

module.exports = {
  generateNewTimestamp,
  generateNewRoomData,
  addPlayerToRoom,
  addTransactionToRoom
}