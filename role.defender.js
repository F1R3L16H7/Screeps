var Action = require('utils.action');

var roleDefender = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var test = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (creepy) => { return creepy.structureType == STRUCTURE_SPAWN && !creepy.my;} });
        if (!test)
            test = creep.pos.findClosestByRange(FIND_CREEPS, { filter: (creepy) => { return !creepy.my;} });
        if (!test)
            creep.suicide();
        if(creep.attack(test) == ERR_NOT_IN_RANGE) {
            Action.move(creep, test);
        }
	}
};

module.exports = roleDefender;