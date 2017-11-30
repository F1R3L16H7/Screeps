var Action = require('utils.action');

var roleAttacker = {

    /** @param {Creep} creep **/
    run: function(creep, flag) {
        var test = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (creepy) => { return creepy.structureType == STRUCTURE_SPAWN && !creepy.my;} });
        if (!test)
            test = creep.pos.findClosestByRange(FIND_CREEPS, { filter: (creepy) => { return !creepy.my;} });
        if (!test || !creep.room.controller || creep.room.controller.safeMode > 0)
           Action.move(creep, Game.flags[flag]);
        else if(creep.attack(test) == ERR_NOT_IN_RANGE) {
            //var err = Action.move(creep, test);
            //if (err)
            
            var path = creep.pos.findPathTo(test, {reusePath: 10, ignoreDestructibleStructures: false});
            var err = creep.moveByPath(path);
            creep.attack(creep.pos.findInRange(FIND_STRUCTURES,2,{ filter: (creepy) => { return creepy.pos.isEqualTo(path[0].x, path[0].y);}})[0]);
        }
	}
};

module.exports = roleAttacker;