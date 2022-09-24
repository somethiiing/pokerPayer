const { EmbedBuilder } = require('discord.js');

const generateNewTimestamp = () => {
  return new Date();
}

const newState = {
  timestamp: new Date(),
  group_id: '38581975',
  bankerId: '57674143',
  // cashId: '57361884',
  users: {
    '199748877899792384': {
      name: 'wilson yu',
      first_name: 'wilson',
      last_name: 'yu',
      email: 'hello@wilsonyu.io',
      swId: '50605347'
    }
  },
  userMap: {
    'wilson yu': '199748877899792384'
  },
  transactions: {},
  toDelete: {},
};

const generateRemainingBalanceString = (balance) => {
  let amount = balance.length > 0 && Number(balance[0].amount);
  if(balance.length === 0 || amount === 0) {
    return 'Settled Up! Remaining Balance: $0';
  } else {
    if (amount > 0) {
      return `Extra money! Banker still has $${amount}`;
    } else {
      return `Short! Banker is short $${Math.abs(amount)}`;
    }
  };
};

const generateSettlements = ({debts, users}) => {
  let hash = {};

  Object.keys(users).forEach( key => {
    hash[users[key].swId] = users[key];
  });

  return debts.map( debt => {
    const fromId = debt.from;
    const fromFullName = `${hash[fromId].name}`;
    const toId = debt.to;
    const toFullName = `${hash[toId].name}`;
    const amt = `$${Number(debt.amount)}`;

    return new EmbedBuilder()
      .setTitle('PAYMENT')
      .setDescription(`${fromFullName} to ${toFullName} - ${amt}`)
      .addFields(
        { name: 'FROM', value: fromFullName, inline: true },
        { name: 'TO', value: toFullName, inline: true },
        { name: 'AMOUNT', value: amt, inline: true },
      )
      .setTimestamp();
  });
}

const generateUnsettledBalance = (str) =>
  new EmbedBuilder()
    .setTitle('NOT SETTLED')
    .setDescription(str)

module.exports = {
  generateNewTimestamp,
  newState,
  generateRemainingBalanceString,
  generateSettlements,
  generateUnsettledBalance
}