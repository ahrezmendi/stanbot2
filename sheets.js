// Utility functions for Google Sheets
const { apikey } = require('./config.json');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const Discord = require('discord.js');
const util = require('./util');

// Some constants, such as the doc itself
const sfvCharacterData = new Discord.Collection();
const doc = new GoogleSpreadsheet('1nlbWon7SYhhO5TSpNx06qQrw2TRDEZ85HQrNherXioY');
doc.useApiKey(apikey);

const characters = ["fang", "dhalsim", "vega", "laura", "zangief", "karin", "rashid", "rmika",
    "necalli", "ken", "birdie", "cammy", "mbison", "nash", "chunli", "ryu", "alex", "guile", "ibuki",
    "balrog", "juri", "urien", "akuma", "kolin", "ed", "abigail", "menat", "zeku young", "zeku old", "sakura", "blanka",
    "falke", "cody", "g", "sagat", "kage", "poison", "ehonda", "lucia", "gill", "seth"];

module.exports = {
    sfvCharacterData,
    loadSFVData() {
        async function processWorksheets() {
            await doc.loadInfo(); // loads document properties and worksheets
            console.log(doc.title);
            console.log("SF5 sheet ready for access.");

            if (!doc.sheetsByIndex.length) return console.log("Something went wrong loading the spreadsheet.");

            for (const sheet of doc.sheetsByIndex) {
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
                if (!characters.includes(charName)) {
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
                    sheetData.set(keyName, row);
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
                console.log("Sleeping 2 seconds before next sheet (rate limits).");
                await util.sleep(2000);
            }

            // Done (I think?)
            return sfvCharacterData;
        }

        return processWorksheets().catch(console.error);
    }
}