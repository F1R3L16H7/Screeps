var Action = require('utils.action');

var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
            var source = creep.pos.findClosestByRange(FIND_SOURCES, {filter: (source) => { 
                var creeps = source.pos.findInRange(FIND_MY_CREEPS, 2, {filter: (c) => {return c.memory.role == "miner" && c.id != creep.id;}});
                return creeps.length == 0;
            }});
            if (source) {
                if (creep.harvest(source) == ERR_NOT_IN_RANGE)
                    Action.move(creep,source);
                /*else
                    if (creep.pos.lookFor(LOOK_STRUCTURES).length <= 0) {
                        Action.move(creep,creep.pos.findInRange(FIND_STRUCTURES, 2, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_STORAGE ||
                                    structure.structureType == STRUCTURE_CONTAINER)
                                    && (_.sum(structure.store) < structure.storeCapacity);
                            }})[0]);
                    }*/
            } else {
                source = creep.pos.findClosestByRange(FIND_SOURCES);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE)
                    Action.move(creep,source);
            }
    }
};

module.exports = roleMiner;