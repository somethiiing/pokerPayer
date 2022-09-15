const {
  GatewayIntentBits,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require('discord.js');

const {
  commandsChannelId,
  logsChannelId,
  rejectedChannelId
} = require('../constants');

const IntentsArray = [
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildMessageReactions,
  GatewayIntentBits.GuildMessageTyping,
  GatewayIntentBits.GuildIntegrations,
  GatewayIntentBits.GuildWebhooks,
  GatewayIntentBits.GuildPresences,
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.DirectMessageTyping,
  GatewayIntentBits.DirectMessageReactions,
];

const decisionsButtonBuilder = (buyinString) => {
  return new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId(`reject`)
      .setLabel('REJECT')
      .setStyle(ButtonStyle.Danger),
  )
  .addComponents(
    new ButtonBuilder()
      .setCustomId(`approve`)
      .setLabel('APPROVE')
      .setStyle(ButtonStyle.Success)
  )
}

const buyInCommand = new SlashCommandBuilder()
  .setName('buyin')
  .setDescription('Buy In')
  .addIntegerOption(option =>
    option.setName('amount')
      .setDescription('Enter the amount you want to buy in for.')
      .setRequired(true)
      .addChoices(
        {name: '$40', value: 40},
        {name: '$60', value: 60},
        {name: '$80', value: 80},
        {name: '$100', value: 100},
        {name: '$120', value: 120},
        {name: '$140', value: 140},
        {name: '$160', value: 160},
        {name: '$180', value: 180},
        {name: '$200', value: 200}
      )
  );

const cashOutCommand = new SlashCommandBuilder()
  .setName('cashout')
  .setDescription('Cash Out')
  .addIntegerOption(option =>
    option.setName('amount')
      .setDescription('Enter the amount you are cashing out for.')
      .setRequired(true)
  );

const registerCommand = new SlashCommandBuilder()
  .setName('register')
  .setDescription('Register yourself before proceeding with the game!')
  .addStringOption(option =>
    option.setName('first_name')
    .setDescription('Enter your first name.')
    .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('last_name')
    .setDescription('Enter your last name.')
    .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('email')
    .setDescription('Enter your email address.')
    .setRequired(true)
  );

const createNewGameCommand = new SlashCommandBuilder()
  .setName('createnewgame')
  .setDescription('Create a new game. Warning: This WILL erase the current game.')
  .addBooleanOption(option =>
    option.setName('absolutely').setDescription('Are you sure?')
  )
  .addBooleanOption(option =>
    option.setName('positive').setDescription('No, seriously are you sure?')
  );

const balanceCommand = new SlashCommandBuilder()
  .setName('viewremainingbalance')
  .setDescription('View how much the banker still has. (Used for debugging cashing out).');

const settleCommand = new SlashCommandBuilder()
  .setName('settle')
  .setDescription('Post who pays who in #poker-payer-log');

const deleteMessage = ({client, channelId, msgId}) => {
  client.channels.cache.get(channelId).messages.fetch(msgId)
  .then(msg => {
    msg.delete();
  })
  .catch(err => console.log(err));
}

const deleteAllMessagesInChannel = ({client, channelId}) => {
  const channel = client.channels.cache.get(channelId)
  channel.messages.fetch({count: 99})
  .then(msgs => {
    channel.bulkDelete(msgs);
  })
}

const decisionEmbedBuilder = ({content, admin, decision}) => {
  const [tNum, tType, name, amount] = content.split(' - ');

  const decisionText = decision === 'approve' ? 'APPROVED' : 'REJECTED';

  return new EmbedBuilder()
      .setTitle(decisionText)
      .setDescription(content)
      .addFields(
        { name: 'Transaction Number', value: tNum, inline: true },
        { name: 'Transaction Type', value: tType, inline: true },
        { name: 'Player', value: name, inline: true },
        { name: 'Amount', value: `${amount}`, inline: true },
        { name: 'Decision By:', value: admin, inline: true}
      )
      .setTimestamp()
}

const logEmbedBuilder = ({content}) => {
  const [tNum, tType, name, amount] = content.split(' - ');

  return new EmbedBuilder()
  .setTitle(tType)
  .setDescription(content)
  .addFields(
    { name: 'Transaction Number', value: tNum, inline: true },
    { name: 'Transaction Type', value: tType, inline: true },
    { name: 'Player', value: name, inline: true },
    { name: 'Amount', value: `${amount}`, inline: true },
  )
  .setTimestamp()
}

const recreateRole = (interaction) => {
  const oldRole = interaction.guild.roles.cache.find(role => role.name === 'Poker - In Game');
  interaction.guild.roles.create({
    name: 'Poker - In Game',
    color: oldRole.color,
    hoist: oldRole.hoist,
    position: oldRole.position,
    permissions: oldRole.permissions,
    mentionable: oldRole.mentionable
  })
  .then((role) => {
    interaction.member.guild.channels.cache.get(commandsChannelId).permissionOverwrites
    .edit(role, {ViewChannel: true, SendMessages: true});
    interaction.member.guild.channels.cache.get(logsChannelId).permissionOverwrites
    .edit(role, {ViewChannel: true, SendMessages: true});
    interaction.member.guild.channels.cache.get(rejectedChannelId).permissionOverwrites
    .edit(role, {ViewChannel: true, SendMessages: true});
  })
  oldRole.delete();
}

module.exports = {
  IntentsArray,
  buyInCommand,
  cashOutCommand,
  registerCommand,
  createNewGameCommand,
  balanceCommand,
  settleCommand,
  decisionsButtonBuilder,
  deleteMessage,
  deleteAllMessagesInChannel,
  decisionEmbedBuilder,
  logEmbedBuilder,
  recreateRole
}
