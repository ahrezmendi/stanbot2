// Utility functions for Google Sheets
const { apikey } = require('./config.json');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const Discord = require('discord.js');
const util = require('./util');

// Some constants, such as the doc itself
const sfvCharacterData = new Discord.Collection();
const doc = new GoogleSpreadsheet('1nlbWon7SYhhO5TSpNx06qQrw2TRDEZ85HQrNherXioY');
doc.useApiKey(apikey);

// const characters = ["f.a.n.g", "dhalsim", "vega", "laura", "zangief", "karin", "rashid", "r. mika",
//     "necalli", "ken", "birdie", "cammy", "m. bison", "nash", "chun-li", "ryu", "alex", "guile", "ibuki",
//     "balrog", "juri", "urien", "akuma", "kolin", "ed", "abigail", "menat", "zeku", "sakura", "blanka",
//     "falke", "cody", "g", "sagat", "kage", "poison", "e. honda", "lucia", "gill", "seth"];
const characters = ['ryu', 'cammy', 'chun-li', 'alex', 'e. honda'];

module.exports = {
    sfvCharacterData,
    loadSFVData() {
        async function processWorksheets() {
            await doc.loadInfo(); // loads document properties and worksheets
            console.log(doc.title);
            console.log("SF5 sheet ready for access.");

            if (!doc.sheetsByIndex.length) return console.log("Something went wrong loading the spreadsheet.");

            for (const sheet of doc.sheetsByIndex) {
                // For every sheet I want the title (it has the character name) and all the cells. Split it now for convience.
                var splitTitle = sheet.title.split(/(?=[A-Z])/);
                console.log(`Sheet title: ${sheet.title}`);
                console.log(`Split sheet title: ${splitTitle}`);

                // KNOWN BROKEN CASES:
                // Zeku (because sheets are named Zeku (Old)Normal, etc. etc.)
                // Anybody with punctuation (R. Mika, E. Honda, etc.)

                // The first item of the split title is the character name. Check here to ensure it's in the character list. If not, skip.
                const charName = splitTitle[0].toLowerCase();
                console.log(`Now processing ${charName}`);
                if (!characters.includes(charName)) {
                    console.log("Character not found in character list.");
                    continue;
                }

                // The 2nd item of the split title is the sheet type. This matters since character data is split across 4 sheets:
                // Normal, Trigger1, Trigger2, Stats
                // Normal is base data, each trigger sheet is what changes when in that VT, and stats are stats (e.g. health, stun, etc.)
                const sheetType = splitTitle[1].toLowerCase();

                // Now we have enough to build a Collection for this sheet. This will contain pairs of moveName:GoogleSpreadsheetRow.
                var sheetData = new Discord.Collection();
                const rows = await sheet.getRows(); // Async action, make note. This caches all row data from the sheet.
                for (const row of rows) {
                    // Normal, Trigger1, and Trigger1 have moveName as the first column.
                    // Stats has just name.
                    var keyName = row.hasOwnProperty('moveName') ? row.moveName : row.name;
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

                // Google has quota for API access (100 requests per 100 seconds). To handle this, the bot will sleep 5 seconds after every sheet load.
                console.log("Sleeping 5 seconds before next sheet (rate limits).");
                await util.sleep(5000);
            }

            // Done (I think?)
            return sfvCharacterData;
        }

        return processWorksheets().catch(console.error);
    }
}