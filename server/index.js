require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {
  Client,
  REST,
  Routes,
} = require('discord.js');

const {
  notRegisteredMsg,
  doesNotWorkMsg,
  noPermissionMsg,
  joinGameChannelId,
  adminChannelId,
  commandsChannelId,
  logsChannelId,
  rejectedChannelId,
  errorTryAgainMsg
} = require('./constants')

const {
  generateNewTimestamp,
  newState,
  generateRemainingBalanceString,
  generateSettlements,
  generateUnsettledBalance
} = require('./utils/utils');

const {
  createRoom,
  processCreateRoomData,
  addUserToGroup,
  getGroupData,
  addBuyIn,
  addCashOut
} = require('./utils/splitwise');

const {
  IntentsArray,
  buyInCommand,
  cashOutCommand,
  joinCommand,
  decisionsButtonBuilder,
  deleteMessage,
  deleteAllMessagesInChannel,
  decisionEmbedBuilder,
  createNewGameCommand,
  recreateRole,
  logEmbedBuilder,
  balanceCommand,
  settleCommand
} = require('./utils/discord');

const PORT = process.env.PORT||5000

// EXPRESS CONFIG
const app = express();
app.use(cors())
.use(bodyParser.urlencoded({ extended: false }))
.use(bodyParser.json())
.use((req, res, next) => {
  state.timestamp = generateNewTimestamp();
  next();
})
.use((req, res, next) => {
  res.set({
    'ngrok-skip-browser-warning': true,
  });
  next();
})
// .use(express.static(path.join(__dirname, '../build')));

// DISCORD CLIENT CONFIG
const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN);
const client = new Client({
  intents: IntentsArray
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
client.login(process.env.CLIENT_TOKEN);

app.listen(PORT, () => {
  console.log(`Poker Payer running on port ${PORT}`);
});

// STATE
let counter = 0;
let state = Object.assign({}, newState);

// API ROUTES
app.get('/api/', (req, res) => {
  const { group_id, bankerId, users, userMap, } = state;
  res.send({
    group_id,
    bankerId,
    users,
    userMap
  });
  // res.sendStatus(200);
});

app.get('/api/getSplitwiseData', (req, res) => {
  getGroupData({group_id: state.group_id})
  .then(data => {
    res.send(data);
  })
});

app.get('/api/deleteMessages', (req, res) => {
  const channelId = req.query.channelId;

  deleteAllMessagesInChannel({client, channelId})
  res.sendStatus(200)
});

// DISCORD ROUTES
client.on('messageCreate', msg => {
  if (msg.author.id === '1016975459977797653') {
    const content = msg.content;
    if (content[0] === '#') {
      state.toDelete[content] = msg.id;
    }
  }
})

// REGISTER
client.on('interactionCreate', async interaction => {
  const ignore = ['join'];
  if(!ignore.includes(interaction.commandName)) return;
  const userID = interaction.user.id;

  if(interaction.channelId !== joinGameChannelId) {
    let channelName = client.channels.cache.get(joinGameChannelId).toString();
    await interaction.reply(doesNotWorkMsg(channelName));
  } else {
    if (interaction.commandName === 'join') {
      const { group_id } = state;
      const [first_name, last_name, email] = interaction.options['_hoistedOptions'].map(el => el.value);
      const role = interaction.guild.roles.cache.find(role => role.name === 'Poker - In Game');

      addUserToGroup({group_id, first_name, last_name, email})
      .then( () => getGroupData({group_id}))
      .then( async data => {
        const member = data.members.filter( mem => mem.email === email)[0];
        state.users[userID] = {
          first_name: first_name,
          last_name: last_name,
          email: email,
          swId: String(member.id)
        }
        state.userMap[`${first_name} ${last_name}`] = String(userID);

        return interaction.member.edit({roles: [role]})
      })
      .then(async () => await interaction.reply(`Player ${first_name} ${last_name} successfully registered for game!`))
      .catch(async err => {
        console.log(err)
        await interaction.reply('An error occured adding a player')
      })

    }
  }
})

// BUYIN/CASHOUT
client.on('interactionCreate', async interaction => {
  const ignore = ['buyin', 'cashout'];
  if(!ignore.includes(interaction.commandName)) return;
  const userID = interaction.user.id;

  if(interaction.channelId !== commandsChannelId) {
    let channelName = client.channels.cache.get(commandsChannelId).toString();
    await interaction.reply(doesNotWorkMsg(channelName));
  } else {
    if(state.users[userID] === undefined) {
      await interaction.reply(notRegisteredMsg)
    } else {
      const tType = interaction.commandName;
      const channel = client.channels.cache.get(adminChannelId);

      const {first_name, last_name} = state.users[userID];
      const amount = interaction.options['_hoistedOptions'][0].value;
      const content = `#${counter} - ${tType.toUpperCase()} - ${first_name} ${last_name} - $${amount}`;

      state.transactions[`#${counter}`] = {
        status: 'undecided',
        transactionNumber: counter,
        transactionType: tType,
        amount,
        userID,
        interaction
      }
      const approveRejectButtons = decisionsButtonBuilder(content)
      counter++;

      channel.send({
        content: content,
        components: [approveRejectButtons]
      });
      await interaction.deferReply();
    }
  }
});

// CREATENEWGAME/BALANCE/SETTLE
client.on('interactionCreate', async interaction => {
  const ignore = ['createnewgame', 'balance', 'settle'];

  if(!ignore.includes(interaction.commandName)) return;

  if(interaction.channelId !== adminChannelId) {
    let channelName = client.channels.cache.get(adminChannelId).toString();
    await interaction.reply(doesNotWorkMsg(channelName));
  } else {
    const permission = interaction.member.permissionsIn(interaction.channel).has("ADMINISTRATOR");
    if (!permission) {
      await interaction.reply(noPermissionMsg);
    } else {
      if (interaction.commandName === 'createnewgame') {
        const options = interaction.options['_hoistedOptions'];
        if (options.length === 2 && options[0].value && options[1].value) {
          const channels = [joinGameChannelId, adminChannelId, commandsChannelId, logsChannelId, rejectedChannelId];
          channels.forEach( el => deleteAllMessagesInChannel({client, channelId: el}))
          recreateRole(interaction);

          createRoom()
          .then(data => processCreateRoomData(data))
          .then(async data => {
            counter = 0;
            state = Object.assign({}, newState, data);
            state.users['199748877899792384'].swId = data.wyuSwId;
            delete state.wyuSwId;
            await interaction.reply(`Previous game cleared. Game Id: ${data.group_id} created!`)
          })
          .catch(async err => {
            console.log(err);
            await interaction.reply('An error occured!')
          })
        } else {
          await interaction.reply('Options not satisfied. New game not created.')
        }
      }
      if (interaction.commandName === 'balance') {
        const { group_id, bankerId } = state;
        getGroupData({group_id})
        .then( async data => {
          const banker = data.members.filter(el => String(el.id) === bankerId)[0];

          const remainingBalanceString = generateRemainingBalanceString(banker.balance);
          await interaction.reply(remainingBalanceString)
        })
      }
      if (interaction.commandName === 'settle') {
        const { group_id, bankerId } = state;
        getGroupData({group_id})
        .then( async data => {
          const banker = data.members.filter(el => String(el.id) === bankerId)[0];
          const amount = banker.balance.length > 0 && Number(banker.balance[0].amount);
          if (banker.balance.length === 0 || amount === 0) {
            const { simplified_debts } = data;
            const { users } = state;
            const settlements = generateSettlements({debts: simplified_debts, users });

            const logChannel = client.channels.cache.get(logsChannelId);
            let logChannelName = logChannel.toString();

            logChannel.send({
              content: 'Simplified Debts',
              embeds: settlements
            });
            await interaction.reply(`Log generated. Check ${logChannelName} for list of payments.`);
          } else {
            const remainingBalanceString = generateRemainingBalanceString(banker.balance);
            const unsettledBalanceEmbed = generateUnsettledBalance(remainingBalanceString);

            await interaction.reply({embeds: [unsettledBalanceEmbed]});
          }
        })
      }
    }
  }
});

// APPROVE/REJECT
client.on('interactionCreate', async interaction => {
  const ignore = ['approve', 'reject'];

  if (!ignore.includes(interaction.customId)) return;

  if(interaction.customId === 'approve') {
    const content = interaction.message.content;
    const [tNum, tType, name, amount] = content.split(' - ');
    const { bankerId, group_id, userMap, users  } = state;
    const disId = userMap[name];
    const { swId } = users[disId];

    let tTypeFunc = tType === 'BUYIN' ? addBuyIn : addCashOut;

    tTypeFunc({
      group_id,
      bankerId,
      player: swId,
      amount: Number(amount.replace('$', '')),
      full_name: name
    })
    .then( async data => {
      const approvedEmbed = decisionEmbedBuilder({
        content,
        admin: interaction.member.nickname,
        decision: 'approve'
      });

      state.transactions[tNum].status = 'approved'
      client.channels.cache.get(logsChannelId).send({ embeds: [logEmbedBuilder({content})] });
      deleteMessage({client, channelId: adminChannelId, msgId: state.toDelete[content]});
      await state.transactions[tNum].interaction.editReply({embeds: [approvedEmbed]});
    })
    .catch(async err => {
      console.log('ERROR', err);
      await interaction.reply('An error occured adding a buy in.');
      await state.transactions[tNum].interaction.editReply(errorTryAgainMsg);
    })

  }

  if(interaction.customId === 'reject') {
    const content = interaction.message.content;
    const [tNum] = content.split(' - ');

    const rejectedEmbed = decisionEmbedBuilder({
      content,
      admin: interaction.member.nickname,
      decision: 'rejected'
    });

    state.transactions[tNum].status = 'rejected';
    client.channels.cache.get(rejectedChannelId).send({ embeds: [rejectedEmbed] })
    deleteMessage({client, channelId: adminChannelId, msgId: state.toDelete[content]})
    await state.transactions[tNum].interaction.editReply({embeds: [rejectedEmbed]})
  }
});

// LOGS
client.on('interactionCreate', async interaction => {
  console.log('interaction', interaction.commandName)
});

const commands = [
  buyInCommand,
  cashOutCommand,
  joinCommand,
  createNewGameCommand,
  balanceCommand,
  settleCommand,
];

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
