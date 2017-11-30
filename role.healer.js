var roleHealer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        const target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: function(object) {
                return object.memory.role == "defender";
            }
        });
        if(target) {
            creep.moveTo(target);
            if (creep.hits < creep.hitsMax/2)
                creep.heal(creep);
            else if(creep.pos.isNearTo(target)) {
                creep.heal(target);
            }
            else {
                creep.rangedHeal(target);
            }
        }
	}
};

module.exports = roleHealer;