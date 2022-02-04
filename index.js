//TL BOT - Written by DANIEL3232

//Initializations:
const { Client, Intents, Message, User, Channel, Role } = require('discord.js');
const { fetch } = require('node-fetch');
const { token } = require('./auth.json');

//google sheets
const { google } = require('googleapis');
const fs = require('fs');
const readline = require('readline');
//Attack Timing Spreadsheet
const personalSpreadsheetId = '17m2fSXSTwMZJR63RJgtcRKS5unjERzfOHM6zV-DbiE8';

//TL Competitive Roster
const tlCompSpreadsheetId = '17UNx2QOV_pIgZOhEfBmqLxWG0-UML7TmOG2ixOnV5_I';

//TL Practice Roster
const tlPracSpreadsheetId = '1KhAyQBYxsNUFWMyVpk9yd1sqLiFXDuwRDQubRQ_LA-k';

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
        Intents.FLAGS.GUILD_MEMBERS
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

//TL Ping - Bot replies with 'Pong'
//TL CAM Comp Roster General - TL CAM + "SpreadSheetName = 'Personal', 'Comp'" + 'Prac'" + TabName="Roster" + "Channel Name"



client.on('messageCreate', msg => {
    var command = '';
    var nameHolder = '';
    var cmdArray = new Array;

    if (msg.content.split(" ", 1).toLowerCase === prefix);
    {
        cmdArray = msg.content.split(" ");
        if (cmdArray.length > 1) {
            command = cmdArray[1].toLowerCase();
        }

    }

    switch (command) {
        case 'help':
            msg.channel.send(` Help? Current Commands:
            "TL Help" - Bot replies with all commands.
            "TL Ping" - Bot replies Pong.
            "TL CAM" - Personal Roster General"
\t\tTL
\t\tCAM - Count Active Members
\t\tPersonal - Spreadsheet Name = 'Personal', 'Comp', 'Prac'
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
                //shows all channel ids
                //console.log(value.id)
            }

            //gets members in voice chat
            const voiceChannel = msg.client.channels.cache.get(channelId);
            //console.log(voiceChannel);

            var string = JSON.stringify(voiceChannel.members);
            var members = JSON.parse(string);

            //json data parsed and stringified
            //[{ "guildId": "850839139380887582", "joinedTimestamp": 1622927999713, "premiumSinceTimestamp": null, "nickname": "Sexy Gorgeous Big Dick Haver", "pending": false, "communicationDisabledUntilTimestamp": null, "userId": "151651051655659520", "avatar": null, "displayName": "Sexy Gorgeous Big Dick Haver", "roles": ["850844826155876372", "933123362107052123", "850839139380887582"], "avatarURL": null, "displayAvatarURL": "https://cdn.discordapp.com/avatars/151651051655659520/594762e38d79a5b77e8501f88b078575.webp" }, { "guildId": "850839139380887582", "joinedTimestamp": 1622926258660, "premiumSinceTimestamp": null, "nickname": null, "pending": false, "communicationDisabledUntilTimestamp": null, "userId": "328578198059221003", "avatar": null, "displayName": "DANIEL3232", "roles": ["850844826155876372", "933123362107052123", "850839139380887582"], "avatarURL": null, "displayAvatarURL": "https://cdn.discordapp.com/avatars/328578198059221003/bd325a4829f653f7a9d230b57b2bb070.webp" }]

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
        case 'p-r':
            msg.channel.send('exporting all members with declared role');

            let roleId = '772656272935092225';
            let termpGuildId = '770979733076836393';

            getMembers();

            async function getMembers() {
                return await msg.guild.members.fetch()  // fetch all members and cache them
            }
 
            const role = msg.guild.roles.cache.get(roleId) // get role from cache by ID (roles are always cached)
            const list = role.members.map(m => m.nickname) // map members by nickname

            console.log(msg.guild.members.cache.size);
            console.log(list);

            //msg.guild.roles.fetch(roleId)
            //.then(role => console.log(role.members))
            //    .catch(console.error);


            //msg.guild.members.fetch(roleId)
            //    .then(members => console.log(role.members))
            //    .catch(console.error);



            //let role = msg.guild.roles.cache.find(r => r.name === 'Sysadmins');
            //console.log(role);

            //msg.guild.roles.fetch('811834212629610508');
            
            //console.log(msg.guild.roles.cache.get(roleID).members.size);
            //let list = msg.guild.roles.cache.get(roleID).members.map(m => m.nickname)
            //let list = msg.guild.roles.cache.get(roleID).members.map(m => m.user.tag)

            //console.log(role);
            

            //let list = list.roles.cache.get(roleID).members.map(m => m.user.id);
            //let list = msg.guild.members.cache.filter(m => m.roles.cache.get(roleID));

            //pulls all servers discord bot is on
            //let list = client.guilds.cache;

            //try {
            //    await list.members.fetch();

            //    let role1 = list.roles.cache.get(roleID).members.map(m => m.user.id);
            //    console.log(role1);
            //} catch (err) {
            //    console.error(err);
            //}


            //let roleID = "772656272935092225";
            //let membersWithRole = msg.guild.roles.cache.get(roleID).members.map(m => m.user.id);
            //let membersWithRole = msg.guild.roles.cache.get(roleID).guild.members;
            //console.log(membersWithRole);


            //console.log(`Got ${membersWithRole.size} members with that role.`);

            //const rolesMap = new Map(msg.guild.roles.cache);

            //for (const [key, value] of rolesMap) {
            //    if (value.name === 'TL Comp Recruit'
                    //&& value.name.includes(nameHolder)
                //) {
                    //value
                    //var guildId = value.guild.id;
                    //var channelId = value.id;
                    //console.log(value.id)
                //}
                //if (channelId === 'undefined') {
                //    msg.reply('That voice channel does not exist')
                //    break;
                //}
                //shows all channel ids
                //console.log(value.id)
            //}



            //displays entire map 
            //console.log(rolesMap);


            //let membersWithRole = msg.guild.members.filter(member => {
            //    return member.roles.find("name", roleName);
            //}).map(member => {
            //    return member.user.username;
            //})


            //let tempMembers = msg.guild.roles.cache.find(role => role.id === '811834212629610508').members.map(m => m.user.tag);

            //let tempMembers = msg.guild.roles.get('811834212629610508').members.map(m => m.user.id);

            //console.log(membersWithRole);

            //for (var i = 0; i < tempMembers.length; i++) {
            //    //console.log(members[i]['displayName']);
            //    sheetsData.push([tempMembers[i]]);
            //}

            //sheetsData = tempMembers;

            //authorizeGoogleSheets();
            break;
        default:
            break;
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


