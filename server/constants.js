const notRegisteredMsg = 'Player not registered. Please use /register before using other commands.';

const doesNotWorkMsg = (channelName) => `This command does not work unless in ${channelName} channel!`;

const noPermissionMsg = 'You do not have permission to use this command';

const errorTryAgainMsg = 'An error occurred adding this buy in. Please check with admin before trying again';

const joinGameChannelId = '1016977857995603987';
const adminChannelId = '1017586908903247932';
const commandsChannelId = '1017586772152176720';
const logsChannelId = '1017586859330781244';
const rejectedChannelId = '1017587078474760272';

module.exports = {
  notRegisteredMsg,
  doesNotWorkMsg,
  noPermissionMsg,
  errorTryAgainMsg,
  joinGameChannelId,
  adminChannelId,
  commandsChannelId,
  logsChannelId,
  rejectedChannelId,
}