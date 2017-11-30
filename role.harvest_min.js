var roleUpgrader = require('role.upgrader');
var Action = require('utils.action');

var roleHarvest_min = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.memory.building && _.sum(creep.carry) == 0) {
            creep.memory.building = false;
            //creep.say('ð harvest');
	    }
	    if(!creep.memory.building && _.sum(creep.carry) == creep.carryCapacity) {
	        creep.memory.building = true;
	        //creep.say('ð§ build');
	    }
        if(!creep.memory.building) {
            
        var tmp = creep.pos.findClosestByRange(FIND_MINERALS);
        if (tmp)
            if (creep.harvest(tmp) == ERR_NOT_IN_RANGE)
                Action.move(creep, tmp);
        }
        else {
            
            /*var target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                    filter: (resource) => {
                        return resource.resourceType != RESOURCE_ENERGY;
                    }});
            if(target) {
                if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } */
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType == STRUCTURE_TERMINAL)
                        && (_.sum(structure.store) < structure.storeCapacity));
                }
            });
            if (target) {
                for(const resourceType in creep.carry) {
                    if (creep.transfer(target, resourceType) == ERR_NOT_IN_RANGE) {
                        Action.move(creep, target);
                    }
                }
            } else {
                roleUpgrader.run(creep);
            }
        }
    }
};

module.exports = roleHarvest_min;