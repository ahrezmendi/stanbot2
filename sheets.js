// Utility functions for Google Sheets
const { apikey } = require('./config.json');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const Discord = require('discord.js');
const util = require('./util');

// Internal constants, such as doc identifiers
const sfvDoc = new GoogleSpreadsheet('1nlbWon7SYhhO5TSpNx06qQrw2TRDEZ85HQrNherXioY');
const dbfzDoc = new GoogleSpreadsheet('1-p29UmRGIPF6n17ddOEtYfLcn_KRlE2VH6tE61P5UM8');

// Exported variables, which can be used in other modules
var sfvCharacterData = new Discord.Collection();
var dbfzCharacterData = new Discord.Collection();

// Set document API Keys here
sfvDoc.useApiKey(apikey);
dbfzDoc.useApiKey(apikey);

const sfvCharacters = ["fang", "dhalsim", "vega", "laura", "zangief", "karin", "rashid", "rmika",
    "necalli", "ken", "birdie", "cammy", "mbison", "nash", "chunli", "ryu", "alex", "guile", "ibuki",
    "balrog", "juri", "urien", "akuma", "kolin", "ed", "abigail", "menat", "zeku young", "zeku old", "sakura", "blanka",
    "falke", "cody", "g", "sagat", "kage", "poison", "ehonda", "lucia", "gill", "seth"];

const dbfzCharacters = ['android 16', 'android 17', 'android 18', 'android 21', 'broly dbs', 'gohan adult', 'goku ssj',
    'bardock', 'beerus', 'broly', 'cpt ginyu', 'cell', 'cooler', 'frieza', 'gogeta', 'gohan teen', 'goku base', 'goku blue',
    'goku black', 'gotenks', 'hit', 'janemba', 'jiren', 'kid buu', 'krillin', 'majin buu', 'nappa', 'piccolo', 'tien',
    'trunks', 'vegeta', 'vegeta ssj', 'vegeta blue', 'vegito', 'videl', 'yamcha', 'zamasu'];

module.exports = {
    // Main loading function, calls all individual sheet loading functions
    loadSpreadsheetData() {
        this.loadSFVData();
        this.loadDbfzData();
    },

    // SFV Character Data and loading functions
    sfvCharacterData,
    loadSFVData() {
        async function processWorksheets() {
            await sfvDoc.loadInfo(); // loads document properties and worksheets
            console.log(sfvDoc.title);
            console.log("SF5 sheet ready for access.");

            if (!sfvDoc.sheetsByIndex.length) return console.log("Something went wrong loading the spreadsheet.");

            for (const sheet of sfvDoc.sheetsByIndex) {
                // Sheet titles include punctuation, which I don't want. Get rid of it.
                var cleanTitle = sheet.title.replace(/[^\w\s]/g, '');

                // For every sheet I want the title, both for the character name and the sheet type.
                // The character name and sheet type are capitalized, but some characters have multiple caps (e.g. E. Honda).
                // The last item will always be the sheet type though, so popping that off will give exactly what is wanted.
                var splitTitle = cleanTitle.split(/(?=[A-Z])/);

                // Character data is split across 4 sheets, which I'm calling the sheetType:
                // Normal, Trigger1, Trigger2, Stats
                // Normal is base data, each trigger sheet is what changes when in that VT, and stats are stats (e.g. health, stun, etc.)
                const sheetType = splitTitle.pop().toLowerCase();

                // Character name is all that's left now
                const charName = splitTitle.join('').toLowerCase();

                // Check to make sure the character is in the configured character list
                console.log(`Now processing ${charName} ${sheetType}`);
                if (!sfvCharacters.includes(charName)) {
                    console.log("Character not found in character list.");
                    continue;
                }

                // Now we have enough to build a Collection for this sheet. This will contain pairs of moveName:GoogleSpreadsheetRow.
                var sheetData = new Discord.Collection();
                const rows = await sheet.getRows(); // Async action, make note. This caches all row data from the sheet.
                for (const row of rows) {
                    // Normal, Trigger1, and Trigger1 have moveName as the first column.
                    // Stats has just name.
                    // Edge Case: Turns out Gill has 'move' instead of 'moveName'. So check that after assigning.
                    var keyName = row.hasOwnProperty('moveName') ? row.moveName : row.name;
                    if (!keyName) keyName = row.move; // Thanks, Gill. Emperors always gotta be different.
                    if (!keyName) console.error('Critical error while parsing SFV spreadsheet. Someone screwed up.');
                    sheetData.set(keyName.toLowerCase(), row);
                }

                // Check if this character is already in the data (e.g. from loading other sheet data)
                if (!Array.from(sfvCharacterData.keys()).includes(charName)) {
                    // If it doesn't exist, create a new Collection and add this sheet data to that. Then add that to the main data collection.
                    var charSheets = new Discord.Collection();
                    charSheets.set(sheetType, sheetData);
                    sfvCharacterData.set(charName, charSheets);
                } else {
                    // If they do exist in the data, then add this sheet to their existing sheets collection
                    sfvCharacterData.get(charName).set(sheetType, sheetData);
                }

                // Google has quota for API access (100 requests per 100 seconds). To handle this, the bot will sleep 2 seconds after every sheet load.
                console.log("Sleeping 4 seconds before next sheet (rate limits).");
                await util.sleep(4000);
            }

            // Done (I think?)
            return sfvCharacterData;
        }

        return processWorksheets().catch(console.error);
    },
    refreshSFVData() {
        return this['sfvCharacterData'] = this.loadSFVData();
    },

    // DBFZ Character Data and loading functions
    dbfzCharacterData,
    loadDbfzData() {
        async function processWorksheets() {
            await dbfzDoc.loadInfo(); // loads document properties and worksheets
            console.log(dbfzDoc.title);
            console.log("DBFZ sheet ready for access.");

            if (!dbfzDoc.sheetsByIndex.length) return console.log("Something went wrong loading the spreadsheet.");

            // Iterate over all sheets and process each one
            for (const sheet of dbfzDoc.sheetsByIndex) {
                // Sheet titles include punctuation, which I don't want. Get rid of it.
                var cleanTitle = sheet.title.replace(/[^\w\s]/g, '');

                // For every sheet I want the title (it is the character name)
                // var charName = cleanTitle.split(/(?=[A-Z])/).join('').toLowerCase();
                var charName = cleanTitle.toLowerCase();

                // Check to make sure the character is in the configured character list
                console.log(`Now processing ${charName}`);
                if (!dbfzCharacters.includes(charName)) {
                    console.log("Character not found in character list.");
                    continue;
                }

                // Now we have enough to build a Collection for this sheet. This will contain pairs of moveName:GoogleSpreadsheetRow.
                var sheetData = new Discord.Collection();
                const rows = await sheet.getRows(); // Async action, make note. This caches all row data from the sheet.
                for (const row of rows) {
                    // This spreadsheet has occassional empty rows, which show up here as objects with empty _rawData properties.
                    // These can be skipped.
                    if (!row._rawData.length) continue;

                    // After normal moves, the Assists are in the sheets. These don't follow the same format though
                    // so I have to special case them.
                    // TODO - Special handling for assists

                    // First colum is MOVE which is the move input (names aren't used)
                    var keyName = row.MOVE;
                    console.log(`Key name: ${keyName}`);
                    if (!keyName) console.error('Critical error while parsing DBFZ spreadsheet. Someone screwed up.');
                    sheetData.set(keyName.toLowerCase(), row);
                }

                dbfzCharacterData.set(charName, sheetData);

                // Google has quota for API access (100 requests per 100 seconds). To handle this, the bot will sleep 2 seconds after every sheet load.
                console.log("Sleeping 4 seconds before next sheet (rate limits).");
                await util.sleep(4000);
            }

            // Done (I think?)
            return dbfzCharacterData;
        }

        return processWorksheets().catch(console.error);
    },
    refreshDbfzData() {
        return this['dbfzCharacterData'] = this.loadDbfzData();
    }
}