var Action = require('utils.action');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep, roomy) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            //creep.say('🔄 harvest');
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	        //creep.say('⚡ upgrade');
	    }

	    if(creep.memory.upgrading) {
	        var test = creep.room.controller;
	        if (!test || !test.my)
	            test = Game.rooms["E37N19"].controller;
            if(creep.upgradeController(test) == ERR_NOT_IN_RANGE) {
                Action.move(creep, test);
            }
        }
        else {
            var target = creep.pos.findInRange(FIND_STRUCTURES, 3, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_LINK && structure.energy > 0);
                    }})[0];
            if (!target) {
                target = creep.pos.findInRange(FIND_STRUCTURES, 5, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE)
                            && structure.store[RESOURCE_ENERGY] > 0);
                    }})[0];
            }
            if (target) {
                if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    Action.move(creep, target);
                }
            } else {
                Action.harvest(creep);
            }
        }
	}
};

module.exports = roleUpgrader;