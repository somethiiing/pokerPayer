require('dotenv').config();
const Splitwise = require('splitwise');

const BANKER_EMAIL = 'bankerbanker2@banker.com';
const CASH_EMAIL = 'cashcash@cash.com'
const WYU_EMAIL = 'hello@wilsonyu.io'

const sw = Splitwise({
  consumerKey: process.env.SPLITWISE_CONSUMER_KEY,
  consumerSecret: process.env.SPLITWISE_CONSUMER_SECRET
});

const createRoom = () => {
  return sw.createGroup({
    name: `Poker - ${new Date().toLocaleDateString()}`,
    group_type: 'house',
    simplify_by_default: true,
    users: [
      {first_name: 'Wilson', last_name: 'Yu', email: WYU_EMAIL},
      {first_name: 'BANKER', last_name: '', email: BANKER_EMAIL},
      // {first_name: 'CASH', last_name: '', email: CASH_EMAIL}
    ]
  })
}

const addUserToGroup = ({group_id, first_name, last_name, email}) => {
  return sw.addUserToGroup({
    group_id,
    first_name,
    // last_name,
    email
  })
}

const addBuyIn = ({group_id, bankerId, player, amount, full_name}) => {
  return sw.createDebt({
    group_id,
    from: bankerId,
    to: player,
    amount: amount.toFixed(2),
    description: `BUYIN - ${full_name} - ${amount}`,
  })
}

const addCashOut = ({group_id, bankerId, player, amount, full_name}) => {
  return sw.createDebt({
    group_id,
    from: player,
    to: bankerId,
    amount: amount.toFixed(2),
    description: `CASHOUT - ${full_name} - ${amount}`,
  })
}

const getGroupData = ({group_id}) => {
  return sw.getGroup({
    id: group_id
  });
}

const processCreateRoomData = (data) => {
  const bankerId = data.members.filter(mem => mem.email === BANKER_EMAIL)[0].id;
  // const cashId = data.members.filter(mem => mem.email === CASH_EMAIL)[0].id;
  const wyuSwId = data.members.filter(mem => mem.email === WYU_EMAIL)[0].id;

  return {
    name: data.name,
    group_id: String(data.id),
    bankerId: String(bankerId),
    // cashId: String(cashId),
    wyuSwId: String(wyuSwId),
  }
}

// const addCashToPool = ({group_id, cashId, player, amount, full_name}) => {}
// const receiveCash = ({group_id, cashId, player, amount, full_name}) => {}

module.exports = {
  BANKER_EMAIL,
  CASH_EMAIL,
  WYU_EMAIL,
  createRoom,
  addUserToGroup,
  addBuyIn,
  addCashOut,
  getGroupData,
  processCreateRoomData
}

// sw.test()
//   .then(data => {
//     console.log(data)
//   })

// sw.getUser()
//   .then(data => {
//     console.log(data);
//   })

// sw.getCurrentUser()
// .then(data => { console.log(data) })

// sw.createGroup({
//   name: 'poker test - 1',
//   group_type: 'other',
//   simplify_by_default: true,
//   users: [
//     {first_name: 'BANKER', last_name: '', email: 'banker1@test.com'},
//     {first_name: 'CASH', last_name: '', email: 'cash1@test.com'}
//   ]
// })
// .then(data => console.log('createGroup', data))

// sw.addUserToGroup({
//   group_id: 37927118,
//   first_name: 'kevin',
//   last_name: 'torbet',
//   email: ''
// })


// sw.addUserToGroup({
//   group_id: 37927118,
//   first_name: 'victor',
//   last_name: 'ko',
//   email: ''
// })
// .then(data => {
//   // console.log('addUserToGroup', data)
//   sw.getGroup(37927118)
//   .then(data => {
//     console.log(data);
//   })
// })

// sw.addUserToGroup({
//   group_id: 38095148,
//   first_name: 'john',
//   last_name: 'chen',
//   email: ''
// })
// .then(data => {
//   // console.log('addUserToGroup', data)
//   sw.getGroup({
//     id: 38095148
//   })
//   .then(data => {
//     console.log(data);
//   })
// })
// .catch(err => console.log(err))

// sw.getGroup({
//   id: 37876741
// })
// .then(data => console.log('getGroup', data))

// sw.createExpense({
//   cost: '40.00',
//   description: 'BUYIN - 40 - victor lui',
//   group_id: 37876741,
//   users: [
//     {user_id: 57361883, paid_share: '40.00',}, /*BANKER*/
//     {user_id: 57361947, owed_share: '40.00',},
//   ]
// })

// sw.createDebt({
//   from: 57361719,
//   to: 57360773,
//   amount: '40.00',
//   description: 'BUYIN - 40 - kevin torbet',
//   group_id: 37876538
// })
// .then(data => console.log('createDebt', data))

// addBuyIn({
//   group_id: 37876741,
//   bankerId: 57361883,
//   player: 57423601,
//   full_name: 'victor ko',
//   amount: 100
// })
// .then(data => {
//   console.log(data);
// })

// addCashOut({
//   group_id: 37876741,
//   bankerId: 57361883,
//   player: 57361946,
//   full_name: 'john chen',
//   amount: 75
// })
// .then(data => {
//   console.log(data);
// })


// sw.createGroup({
//   name: `poker testing wtf`,
//   group_type: 'house',
//   simplify_by_default: true,
//   users: [
//     {first_name: 'Wilson', last_name: 'Yu', email: WYU_EMAIL},
//     {first_name: 'BANKER', last_name: 'app', email: BANKER_EMAIL},
//     {first_name: 'CASH', last_name: 'app', email: CASH_EMAIL},
//   ]
// })
// .then(data =>{
//   console.log(data)
// })


// sw.getGroup({id: 38127825})
// .then(data => {
//   console.log(data)
// })