var Action = require('utils.action');

var roleCarrier = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            //creep.say('ð harvest');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        //creep.say('ð§ build');
	    }
        if(!creep.memory.building) {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE)
                            && structure.store[RESOURCE_ENERGY] > 0);
                    }});
            if (target) {
                if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    Action.move(creep, target);
                }
            } 
        }
        else {
            var target = creep.room.terminal;
            if (target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    Action.move(creep, target);
                }
            } else {
                roleUpgrader.run(creep);
            }
        }
    }
};

module.exports = roleCarrier;