const Discord = require('discord.js');
const util = require('../../util');

describe("Commands", function () {
    var registervoicecategory = require('../../commands/registervoicecategory');

    beforeEach(function () { });

    describe("When registervoicecategory is called it", function () {
        var msg = new Discord.Message();
        var args = ['Test', 'Voice', 'Category'];

        beforeEach(function () {
            spyOn(msg, 'react');
            spyOn(util, 'performAdminCheck');
        });

        it("should set the category", function () {
            // Expect the default at the start
            expect(registervoicecategory.category).toBe('On-Demand Voice');

            // Register a new category
            registervoicecategory.execute(msg, args);

            // Expect the new category to be set
            expect(registervoicecategory.category).toBe('test voice category');

            // Expect an emoji reaction
            expect(msg.react).toHaveBeenCalledWith('👌');
        });
    });
});
