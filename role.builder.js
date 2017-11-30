var roleUpgrader = require('role.upgrader');
var Action = require('utils.action');
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            //creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        //creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
	        var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if(target) {
                Action.build(creep, target);
            } else {
                roleUpgrader.run(creep);
            }
	    }
	    else {
            var target = creep.pos.findInRange(FIND_STRUCTURES, 3, {
                    filter: (structure) => {
                        return
                            ((structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE)
                            && structure.store[RESOURCE_ENERGY] > 0);
                    }})[0];
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

module.exports = roleBuilder;