var roleBuilder = require('role.builder');
var roleUpgrader = require('role.upgrader');
var Action = require('utils.action');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep, flag) {
        if (flag && Game.flags[flag].room && Game.flags[flag].room.find(FIND_CREEPS, { filter: (creepy) => { return !creepy.my;} }).length > 0)
            flag = null;
	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            //creep.say('ð harvest');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        //creep.say('ð§ build');
	    }
        if(!creep.memory.building) {
            if (flag && creep.room.controller && creep.room.controller.my)
                Action.move(creep, Game.flags[flag])
            else
                Action.harvest(creep);
        }
        else {
            var target = Action.find_transfer(creep);
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

module.exports = roleHarvester;