var Action = require('utils.action');

var roleRobber = {

    /** @param {Creep} creep **/
    run: function(creep, flag) {
        //creep.say("Hi");
        var test = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (creepy) => { return (creepy.structureType == STRUCTURE_SPAWN ||
        creepy.structureType == STRUCTURE_EXTENSION) && !creepy.my;} });
        if (creep.carry.energy > 0) {
            creep.drop(RESOURCE_ENERGY);
        } else if (!test || !creep.room.controller || creep.room.controller.my || creep.room.controller.safeMode > 0)
           Action.move(creep, Game.flags[flag])
        else if(creep.withdraw(test, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            Action.move(creep, test);
        }
	}
};

module.exports = roleRobber;