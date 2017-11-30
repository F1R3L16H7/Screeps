var tradeSimple = {
    run: function(room) {
        var term = Game.rooms[room].terminal;
        var step = 0.1
        var energy_price_sell = 0.300;
        var energy_price_buy = 0.100;
        var max_buy = 0.300;
        var min_sell = _.sum(term.store) > ((term.storeCapacity*2)/3) ? 0.900 : 1.000;
        var diff = min_sell - max_buy;
        var orders = Game.market.getAllOrders(order => order.amount > 0);
        
        for (const res in term.store) {
            var prix = (res == RESOURCE_ENERGY ? energy_price_sell : (min_sell-((term.store[res]/10000)*step)));
            var exps = _.filter(orders, (order) => order.resourceType == res &&
                order.type == ORDER_BUY && order.price > prix &&
                Game.market.calcTransactionCost(term.store[res], order.roomName, room)*energy_price_sell*2 < term.store[res]*diff);
            var max = exps[0];
            if (max)
                var max_en = Game.market.calcTransactionCost(term.store[res], max.roomName, room);
            for (var i = 0; i < exps.length; i++) {
                var tmp = Game.market.calcTransactionCost(term.store[res], exps[i].roomName, room);
                if (max.price < exps[i].price || (max.price == exps[i].price && max_en > tmp)) {
                    max = exps[i];
                    max_en = tmp
                }
            }
            if (max && term.store[res] > 1000)
                Game.market.deal(max.id, (res == RESOURCE_ENERGY ? term.store[res]/2 : term.store[res]), room);
        }
        
        if (_.sum(term.store) < ((term.storeCapacity*2)/3) && term.store[RESOURCE_ENERGY] > 50000 ) {
            var cheaps = _.filter(orders, (order) => order.type == ORDER_SELL
                && (order.price < energy_price_buy || (order.resouceType != RESOURCE_ENERGY && order.resouceType != RESOURCE_POWER && order.price < max_buy))
                && Game.market.calcTransactionCost(order.amount, order.roomName, room)*energy_price_sell*2 < order.amount*diff);
            for (var i = 0; i < cheaps.length; i++)
                Game.market.deal(cheaps[i].id, cheaps[i].amount, room);
        }
    }
};

module.exports = tradeSimple;