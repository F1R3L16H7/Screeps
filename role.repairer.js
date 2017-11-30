var roleUpgrader = require('role.upgrader');
var Action = require('utils.action');
var roleRepairer = {

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

	    if(creep.memory.building) {
            target = Action.find_rep(creep);
            if (target)
            {
                Action.repair(creep, target);
            } else {
                roleUpgrader.run(creep);
            }
	    }
	    else {
            Action.harvest(creep);
	    }
	}
};

module.exports = roleRepairer;