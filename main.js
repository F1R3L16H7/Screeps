var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleAttacker = require('role.attacker');
var roleSupplyer = require('role.supplyer');
var roleMiner = require('role.miner');
var roleDefender = require('role.defender');
var roleHealer = require('role.healer');
var roleRobber = require('role.robber');
var roleHarvest_min = require('role.harvest_min');
var roleCarrier = require('role.carrier');
var Action = require('utils.action');
var tradeSimple = require('trade.simple');

for (var name in Game.spawns)
    var spawn = name;
    
for (var name in Game.rooms) {
    var room = name;
    if (Game.rooms[room].controller && Game.rooms[room].controller.my)
        break;
}

module.exports.loop = function () {
    if (Game.rooms[room].terminal)
        tradeSimple.run(room);
    
    var dispawn = false;
    if (Game.spawns[spawn].pos.findClosestByRange(FIND_CREEPS, {filter: (creep) => {return !creep.my && creep.hitsMax > 3000;}}))
        dispawn = false;
    
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            //console.log('Clearing non-existing creep memory:', name);
        }
    }
    var protect = false;
    var nukes = Game.rooms[room].find(FIND_NUKES);
    if (nukes.length > 0) {
        for (var nuke in nukes) {
            if (nuke.timeToLand < 100)
                protect = true;
        }
    }
    
    if (Game.spawns[spawn].hits < Game.spawns[spawn].hitsMax/2)
        protect = true;
    
    var towers = Game.rooms[room].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    for (i = 0; i < towers.length ; i++) {
        if (towers[i].hits < (towers[i].hitsMax/2))
            protect = true;
        if(towers[i]) {
            var closestHostile = towers[i].pos.findClosestByRange(FIND_CREEPS, {filter: (creep) => {return !creep.my;}});
            if(closestHostile) {
                towers[i].attack(closestHostile);
            } else {
                var closestDamagedStructure = Action.find_rep(towers[i]);
                if(closestDamagedStructure && towers[i].energy > towers[i].energyCapacity/2) {
                    Action.repair(towers[i],closestDamagedStructure);
                }
            }
        }
    }
    
    if (protect && !(Game.rooms[room].controller.safeMode > 0))
        Game.rooms[room].controller.activateSafeMode();
    
    var link2 = Game.getObjectById('5a0b72f64df5ae710e2d0184');
    if (link2) {
        if (!((Game.time + 15) % 30)) {
            var link3 = Game.getObjectById('5a10b019baaa5c104a8b0e56');
            link3.transferEnergy(link2);
        }
        if (!(Game.time % 30)) {
            var link1 = Game.getObjectById('5a0b3bd5b715183cc23a017e');
            link1.transferEnergy(link2);
        }
    }

    var creeps =  _.filter(Game.creeps, (creep) => creep.my);
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    var attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker');
    var supplyers = _.filter(Game.creeps, (creep) => creep.memory.role == 'supplyer');
    var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
    var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender');
    var healers = _.filter(Game.creeps, (creep) => creep.memory.role == 'healer');
    var robbers = _.filter(Game.creeps, (creep) => creep.memory.role == 'robber');
    var harvest_mins = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvest_min');
    var carriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier');
    
    if (!dispawn) {
        if (Game.rooms[room].energyAvailable < 500 && (creeps.length < 5)) {
            if (harvesters.length < 3) {
                var newName = 'Harv' + Game.time;
                Game.spawns[spawn].spawnCreep([WORK,CARRY,CARRY,MOVE,MOVE], newName,
                    {memory: {role: 'harvester'}});
            } else if (upgraders.length < 1) {
                var newName = 'Up' + Game.time;
                Game.spawns[spawn].spawnCreep([WORK,WORK,CARRY,MOVE], newName,
                    {memory: {role: 'upgrader'}});
            } else if (builders.length < 1) {
                var newName = 'Build' + Game.time;
                Game.spawns[spawn].spawnCreep([WORK,WORK,CARRY,MOVE], newName,
                    {memory: {role: 'builder'}});
            }
        } else if (miners.length < 2) {
            var newName = 'Min' + Game.time;
            Game.spawns[spawn].spawnCreep([WORK,WORK,WORK,WORK,MOVE], newName,
                {memory: {role: 'miner'}});
        } else if (harvesters.length < 3) {
            var newName = 'Harv' + Game.time;
            Game.spawns[spawn].spawnCreep([WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName,
                {memory: {role: 'harvester'}});
        } else if (upgraders.length < 2) {
            var newName = 'Up' + Game.time;
            Game.spawns[spawn].spawnCreep([WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE], newName,
                {memory: {role: 'upgrader'}});
        } else if (supplyers.length < 1) {
            var newName = 'Sup' + Game.time;
            Game.spawns[spawn].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], newName,
                {memory: {role: 'supplyer'}});
        } else if (builders.length < 1 && Game.spawns[spawn].pos.findClosestByRange(FIND_CONSTRUCTION_SITES)) {
            var newName = 'Build' + Game.time;
            Game.spawns[spawn].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], newName,
                {memory: {role: 'builder'}});
        } else if (repairers.length < 0) {
            var newName = 'Rep' + Game.time;
            Game.spawns[spawn].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], newName,
                {memory: {role: 'repairer'}});
        } else if (attackers.length < 0) {
            var newName = 'Att' + Game.time;
            Game.spawns[spawn].spawnCreep([ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE], newName,
                {memory: {role: 'attacker'}});
        } else if (robbers.length < 0) {
            var newName = 'Rob' + Game.time;
            Game.spawns[spawn].spawnCreep([CARRY,CARRY,CARRY,CARRY,MOVE], newName,
                {memory: {role: 'robber'}});
        } else if (harvest_mins.length < 1 && Game.spawns[spawn].pos.findClosestByRange(FIND_MINERALS, {filter: (min) => {return min.mineralAmount > 0;}})) {
            var newName = 'Hm' + Game.time;
            Game.spawns[spawn].spawnCreep([WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], newName,
                {memory: {role: 'harvest_min'}});
        } else if (carriers.length < 0 && Game.rooms[room].terminal.store[RESOURCE_ENERGY] < 20000) {
            var newName = 'Car' + Game.time;
            Game.spawns[spawn].spawnCreep([CARRY,CARRY,CARRY,CARRY,MOVE], newName,
                {memory: {role: 'carrier'}});
        }
    } else {
        if (defenders.length < 1) {
            var newName = 'Def' + Game.time;
            Game.spawns[spawn].spawnCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,MOVE,MOVE,MOVE], newName,
                {memory: {role: 'defender'}});
        } else if (healers.length < 1) {
            var newName = 'Heal' + Game.time;
            Game.spawns[spawn].spawnCreep([HEAL,HEAL,MOVE], newName,
                {memory: {role: 'healer'}});
        }
    }
    
    /*if(Game.spawns[spawn].spawning) {
        var spawningCreep = Game.creeps[Game.spawns[spawn].spawning.name];
        Game.spawns[spawn].room.visual.text(
            'ð ï¸' + spawningCreep.memory.role,
            Game.spawns[spawn].pos.x + 1,
            Game.spawns[spawn].pos.y,
            {align: 'left', opacity: 0.8});
    } else {
        var creep = Game.spawns[spawn].pos.findClosestByRange(FIND_MY_CREEPS);
        Game.spawns[spawn].renewCreep(creep);
    }*/
    var count = 0;
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            if (count < 1 || miners.length < 1)
                roleHarvester.run(creep, null);
            else
                roleHarvester.run(creep, "Spot2");
            count++;
        } else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep, room);
        } else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        } else if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        } else if (creep.memory.role == 'attacker') {
            roleAttacker.run(creep,"Flag2");
        } else if (creep.memory.role == 'supplyer') {
            roleSupplyer.run(creep);
        } else if (creep.memory.role == 'miner') {
            roleMiner.run(creep);
        } else if (creep.memory.role == 'defender') {
            roleDefender.run(creep);
        } else if (creep.memory.role == 'healer') {
            roleHealer.run(creep);
        } else if (creep.memory.role == 'robber') {
            roleRobber.run(creep,"Flag2");
        } else if (creep.memory.role == 'harvest_min') {
            roleHarvest_min.run(creep);
        } else if (creep.memory.role == 'carrier') {
            roleCarrier.run(creep);
        }
        
    }
}