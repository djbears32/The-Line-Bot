//TL BOT - Written by DANIEL3232

//Initializations:
const { Client, Intents, Message, User, Channel, Role } = require('discord.js');
const { fetch } = require('node-fetch');
const { token } = require('./auth.json');

//Testing Repo Change
//google sheets
const { google } = require('googleapis');
const fs = require('fs');
const readline = require('readline');
const { resolve } = require('dns');
//Attack Timing Spreadsheet
const personalSpreadsheetId = '16K4Ilk9Ak5j95Otl_n4ml2Tuipv-g0msY5i50D2xljY';

//TL Competitive Roster
const tlCompSpreadsheetId = '17UNx2QOV_pIgZOhEfBmqLxWG0-UML7TmOG2ixOnV5_I';

//TL Practice Roster
const tlPracSpreadsheetId = '1KhAyQBYxsNUFWMyVpk9yd1sqLiFXDuwRDQubRQ_LA-k';

//FNF Roster
const fnfSpreadsheetId = '1KG8f90wsxNkbg7KOUYwHKTm1p2u0yoJ9QvqWBZ_NMgM';

//NEW TL SERVER
const TLDiscordId = '960321290940604426';

//OLD TL SERVER
const OldDiscordId = '770979733076836393';

//Google Sheet Holder Values
var sheetId = '';
var tabName = '';

var sheetsData = new Array;

const prefix = 'tl';

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.DIRECT_MESSAGES
    ]
});

// Startup Message:
client.once('ready', () => {
    console.log('TLBot is ready.');
});

// Login to Discord with your client's token
client.login(token);

//====================================================================================================//
//                                            BOT COMMANDS                                            //
//====================================================================================================//

client.on('messageCreate', async msg => {
    var command = '';
    var nameHolder = '';
    var cmdArray = new Array;

    if (msg.content.split(" ", 1).toLowerCase === prefix);
    {
        cmdArray = msg.content.split(" ");
        if (cmdArray.length > 1) {
            command = cmdArray[1].toLowerCase();
        }
        switch (command) {
            case 'help':
                msg.channel.send(` Help? Current Commands:
            "TL Help" - Bot replies with all commands.
            "TL Ping" - Bot replies Pong.
            "TL CAM" - Personal Roster General"
\t\tTL
\t\tCAM - Count Active Members
\t\tPersonal - Spreadsheet Name = 'Personal', 'Comp', 'Practice', 'FNF'
\t\tRoster - Tab of Spreadsheet
\t\tGeneral - Channel Name.`);
                break;
            case 'ping':
                //msg.channel.send('pong ' + msg.author.username);
                msg.reply('pong');
                break;
            case 'cam':
                msg.channel.send('counting active members in chat');

                //pulls all information for what sheet and tab to save data to
                if (cmdArray[2] == 'Personal' || 'Comp' || 'Practice') {
                    switch (cmdArray[2]) {
                        case 'Personal':
                            sheetId = personalSpreadsheetId;
                            break;
                        case 'Comp':
                            sheetId = tlCompSpreadsheetId;
                            break;
                        case 'Practice':
                            sheetId = tlPracSpreadsheetId;
                            break;
                        case 'FNF':
                            sheetId = fnfSpreadsheetId;
                            break;
                    }
                    tabName = cmdArray[3];
                }
                if (cmdArray.length > 3) {
                    for (let i = 4; i < cmdArray.length; i++) {
                        nameHolder += (cmdArray[i] + " ");
                    }
                    nameHolder = nameHolder.trim();
                }

                //resets array
                sheetsData = [];

                //give me list of all channels on server
                const theMap = new Map(msg.guild.channels.cache);

                //displays entire map 
                //console.log(theMap);

                //gives both key and value together
                for (const [key, value] of theMap) {
                    if (value.type === 'GUILD_VOICE' && value.name.includes(nameHolder)) {

                        var guildId = value.guild.id;
                        var channelId = value.id;
                        //console.log(value.id)
                    }
                    if (channelId === 'undefined') {
                        msg.reply('That voice channel does not exist')
                        break;
                    }
                }

                //gets members in voice chat
                const voiceChannel = msg.client.channels.cache.get(channelId);

                var string = JSON.stringify(voiceChannel.members);
                var members = JSON.parse(string);

                var name = '';

                //display Value
                for (var i = 0; i < members.length; i++) {
                    //console.log(members[i]['displayName']);
                    name += ((members[i]['displayName']) + '\n');
                    sheetsData.push([members[i]['displayName']]);
                }

                //console.log(members);

                //nickname value
                //for (var i = 0; i < members.length; i++) {
                //console.log(members[i]['nickname']);
                //name += ((members[i]['nickname']) + '\n');
                //}

                //msg.reply(name);

                //calls googlde sheets function
                authorizeGoogleSheets();


                break;
            //grabs all Discord Members in role
            case 'roles':
                msg.channel.send('exporting all members with declared role');

                let roleId = '';

                //pulls all information for what sheet and tab to save data to
                if (cmdArray[2] == 'Personal' || 'Comp' || 'Practice') {
                    switch (cmdArray[2]) {
                        case 'Personal':
                            sheetId = personalSpreadsheetId;
                            break;
                        case 'Comp':
                            sheetId = tlCompSpreadsheetId;
                            break;
                        case 'Practice':
                            sheetId = tlPracSpreadsheetId;
                            break;
                        case 'FNF':
                            sheetId = fnfSpreadsheetId;
                            break;
                    }
                    tabName = cmdArray[3];
                }
                if (cmdArray.length > 3) {
                    roleId = cmdArray[4];
                }

                //resets array
                sheetsData = [];

                let list = client.guilds.cache.get(TLDiscordId);

                try {
                    await list.members.fetch();

                    let role1 = list.roles.cache.get(roleId)

                    for (const [key, value] of role1.members) {
                        sheetsData.push([value.user.id, value.displayName, value.user.discriminator]);
                    }

                } catch (err) {
                    console.error(err);
                }

                authorizeGoogleSheets();

                break;
            case 'names':

                //pulls all information for what sheet and tab to save data to
                if (cmdArray[2] == 'Personal' || 'Comp' || 'Practice') {
                    switch (cmdArray[2]) {
                        case 'Personal':
                            sheetId = personalSpreadsheetId;
                            break;
                        case 'Comp':
                            sheetId = tlCompSpreadsheetId;
                            break;
                        case 'Practice':
                            sheetId = tlPracSpreadsheetId;
                            break;
                        case 'FNF':
                            sheetId = fnfSpreadsheetId;
                            break;
                    }
                    tabName = cmdArray[3];
                }

                //resets array
                sheetsData = [];

                let tempdiscord = client.guilds.cache.find((g) => g.id === TLDiscordId);

                try {
                    await tempdiscord.members.fetch();

                    tempdiscord.members.cache.each(member => sheetsData.push([member.user.id, member.user.username, member.user.discriminator]));
                    //tempdiscord.members.cache.each(member => console.log([(member.user.id)]));

                } catch (err) {
                    console.error(err);
                }

                authorizeGoogleSheets();

                break;
            case 'seeding':

                //pulls all information for what sheet and tab to save data to
                if (cmdArray[2] == 'Personal' || 'Comp' || 'Practice') {
                    switch (cmdArray[2]) {
                        case 'Personal':
                            sheetId = personalSpreadsheetId;
                            break;
                        case 'Comp':
                            sheetId = tlCompSpreadsheetId;
                            break;
                        case 'Practice':
                            sheetId = tlPracSpreadsheetId;
                            break;
                        case 'FNF':
                            sheetId = fnfSpreadsheetId;
                            break;
                    }
                    tabName = cmdArray[3];
                }

                //resets array
                sheetsData = [];

                const channel = client.channels.cache.get(973403637017612378);
                
                await channel.messages.fetch({ limit: 100 }).then(messages => {
                    console.log(`Received ${messages.size} messages`);
                    //Iterate through the messages here with the variable "messages".
                    messages.forEach(message => console.log(message.content))
                })
                console.log(channel);

                const seeder = {steamId: "", playerCount: ""}

                if (msg.channel.id === 973403637017612378)
                {
                    
                }

                authorizeGoogleSheets();

                break;
            default:
                break;
        }
    }

    function sendToGoogleSheets(auth) {
        const sheets = google.sheets({ version: 'v4', auth });
        let values = sheetsData;

        const resource = {
            values,
        };

        sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: tabName + '!A1',
            valueInputOption: 'RAW',
            resource: resource
        }, (err, result) => {
            if (err) {
                // Handle error
                console.log(err);
            } else {
                msg.reply(result.data.updatedCells + ' cells updated, range ' + result.data.updatedRange)
                console.log('%d cells updated on range: %s', result.data.updatedCells, result.data.updatedRange);
            }
        });
    }

    function authorizeGoogleSheets() {
        // If modifying these scopes, delete token.json.
        const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
        // The file token.json stores the user's access and refresh tokens, and is
        // created automatically when the authorization flow completes for the first
        // time.
        const TOKEN_PATH = 'token.json';

        // Load client secrets from a local file.
        fs.readFile('credentials.json', (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Google Sheets API.
            authorize(JSON.parse(content), sendToGoogleSheets);
        });

        /**
         * Create an OAuth2 client with the given credentials, and then execute the
         * given callback function.
         * @param {Object} credentials The authorization client credentials.
         * @param {function} callback The callback to call with the authorized client.
         */
        function authorize(credentials, callback) {
            const { client_secret, client_id, redirect_uris } = credentials.installed;
            const oAuth2Client = new google.auth.OAuth2(
                client_id, client_secret, redirect_uris[0]);

            // Check if we have previously stored a token.
            fs.readFile(TOKEN_PATH, (err, token) => {
                if (err) return getNewToken(oAuth2Client, callback);
                oAuth2Client.setCredentials(JSON.parse(token));
                callback(oAuth2Client);
            });
        }

        /**
         * Get and store new token after prompting for user authorization, and then
         * execute the given callback with the authorized OAuth2 client.
         * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
         * @param {getEventsCallback} callback The callback for the authorized client.
         */
        function getNewToken(oAuth2Client, callback) {
            const authUrl = oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: SCOPES,
            });
            console.log('Authorize this app by visiting this url:', authUrl);
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            rl.question('Enter the code from that page here: ', (code) => {
                rl.close();
                oAuth2Client.getToken(code, (err, token) => {
                    if (err) return console.error('Error while trying to retrieve access token', err);
                    oAuth2Client.setCredentials(token);
                    // Store the token to disk for later program executions
                    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                        if (err) return console.error(err);
                        console.log('Token stored to', TOKEN_PATH);
                    });
                    callback(oAuth2Client);
                });
            });
        }
    }
})


