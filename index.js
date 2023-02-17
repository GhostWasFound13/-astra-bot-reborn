const aoijs = require("aoi.js")
const { Voice, Bot, LoadCommands} = require('aoi.js');
//const { Util } = require( 'aoi.js' );
//const { setup } = require( 'aoi.parser' );
//setup(Util);
const chalk = require("chalk");
const fs = require('fs');
const {
    table
} = require("table");
 const { Panel } = require("@akarui/aoi.panel");
const Discord = require("discord.js")
 // const bot = new aoijs.Bot({
const bot = new aoijs.AoiClient({
  connectedBots: true, 
sharding: true,
shardAmount: 100,
token: process.env.tommy, 
prefix: ["dead", "<@$clientId>"], //<- Change whatever with your prefix//
  fetchInvites: true,
applicationCache: true,
  //intents: "all",
intents: ["Guilds", "GuildMembers", "GuildBans", "GuildEmojisAndStickers", "GuildIntegrations", "GuildWebhooks", "GuildInvites", "GuildVoiceStates", "GuildPresences", "GuildMessages", "GuildMessageReactions", "GuildMessageTyping", "DirectMessages", "DirectMessageReactions", "DirectMessageTyping", "MessageContent"],
mobilePlatform: true,
database: {
    db: require("dbdjs.db"),
    type: "dbdjs.db",
    path: "./database/",
    tables: ["main"]
  }
})
const files = fs.readdirSync('./events').filter(file => file.endsWith('.js'))
files.forEach( x => {
require(`./events/${x}`)(bot)
});

         const Handler = require("./handler.js");
const handler = new Handler(bot);
handler.loadVariables('./dev.js')
handler.loadEvents('./handler/events.js')
handler.loadFunctions('./handler/Funcs/')
handler.loadStatuses('./handler/status.js')
handler.loadCommands('./dev/')