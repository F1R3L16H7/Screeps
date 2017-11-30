var Action = {

    /** @param {Creep} creep **/
    move: function(creep, target) {
	    return creep.moveTo(target, {reusePath: 10, ignoreCreeps: false});
	},
    
    harvest: function(creep) {
        var target = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 2, {
                    filter: (resource) => {
                        return resource.resourceType == RESOURCE_ENERGY && resource.amount > 40;
                    }})[0];
        if (!target)
            target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                    filter: (resource) => {
                        return resource.resourceType == RESOURCE_ENERGY && resource.amount > 300 && creep.pos.inRangeTo(resource.pos, 15);
                    }});
        if(target) {
            if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        } else {
                var source = creep.pos.findClosestByRange(FIND_SOURCES);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE)
                    this.move(creep,source);
        }
        /* target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return ((structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] > 300)
                    && structure.pos.findInRange(FIND_MY_CREEPS, 1, {filter: (c) => {return c.memory.role == "miner";}}).length > 0;
            }});
        if(target) {
            if(creep.withdraw(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        } else {
            var source = creep.pos.findClosestByPath(FIND_SOURCES);
            if (source) {
                if (creep.harvest(source) == ERR_NOT_IN_RANGE)
                    this.move(creep,source);
            } else {
                source = creep.pos.findClosestByRange(FIND_SOURCES);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE)
                    this.move(creep,source);
            }
        }*/
	},
	
	repair: function(creep, target) {
        if(creep.repair(target) == ERR_NOT_IN_RANGE) {
            this.move(creep,target);
        }
	},
	
	build: function(creep, target) {
	    if(creep.build(target) == ERR_NOT_IN_RANGE) {
            this.move(creep,target);
        }
	},
	
	find_rep: function(creep) {
	    var min = 300000;
	    var test;
	    do {
	        test = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER ||
                            //structure.structureType == STRUCTURE_WALL ||
                            structure.structureType == STRUCTURE_RAMPART ||
                            structure.structureType == STRUCTURE_ROAD ||
                            structure.structureType == STRUCTURE_STORAGE ||
                            structure.structureType == STRUCTURE_CONTAINER ||
                            structure.structureType == STRUCTURE_LINK ||
                            structure.structureType == STRUCTURE_TERMINAL) && structure.hits < structure.hitsMax && structure.hits < min;
                    }});
            min *= 10;
	    } while (!test && min < 1000000);
        return test;
        
	},
	
	find_transfer: function(creep) {
	    if (creep.fatigue > 0)
	        return null;
        var tmp = creep.pos.findInRange(FIND_STRUCTURES, 8, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN )
                    && (structure.energy < structure.energyCapacity);
            }
        })[0];
        if(tmp) return tmp;
        tmp = creep.pos.findInRange(FIND_STRUCTURES, 5, {
            filter: (structure) => {
                return ((structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_LINK)
                    && structure.energy < structure.energyCapacity);
            }
        })[0];
        if(tmp) return tmp;
        tmp = creep.pos.findInRange(FIND_STRUCTURES, 3, {
            filter: (structure) => {
                return ((structure.structureType == STRUCTURE_TERMINAL)
                    && (_.sum(structure.store) < (structure.storeCapacity*2)/3));
            }
        })[0];
        if(tmp) return tmp;
        tmp = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE ||
                    structure.structureType == STRUCTURE_CONTAINER)
                    && (_.sum(structure.store) < structure.storeCapacity);
            }
        });
        if(tmp) return tmp;
        tmp = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN )
                    && (structure.energy < structure.energyCapacity);
            }
        });
        return tmp;
	},
	
		
	find_transfer_min: function(creep) {
            var tmp = creep.room.terminal;
            if (tmp) return tmp;
            tmp = creep.room.storage;
            return tmp;
	},
	

};

module.exports = Action;