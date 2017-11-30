var roleUpgrader = require('role.upgrader');
var Action = require('utils.action');

var roleSupplyer = {

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
        if(!creep.memory.building) {
            Action.harvest(creep);
        } else {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER)
                        && structure.energy < structure.energyCapacity;
                }
            });
            if(!target) {
                target = Action.find_transfer(creep);
            }
            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    Action.move(creep, target);
                }
            } else {
                roleUpgrader.run(creep);
            }
        }
    }
};

module.exports = roleSupplyer;