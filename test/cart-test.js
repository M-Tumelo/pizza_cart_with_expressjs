const assert = require('assert');

const pizza_factory = require('../factory_function');

describe('factory_function', function(){

    const pizza_cart = pizza_factory();

    it('should be able to add orders, when the button "Add to order - pizza-size" is clicked', function(){
        pizza_cart.recordAction('smallz');
        pizza_cart.recordAction('mediumz');
        pizza_cart.recordAction('largee');
        assert.deepEqual({
            large: 1, 
            medium: 1, 
            small: 1},
            pizza_cart.getCounter());
    });

    it('should be able to minus pizza quantity', function(){
        pizza_cart.recordAction('min_small_pizza');
        assert.equal(0,pizza_cart.getCounter().small);
    });

    it('should be able to add and give the right totals', function(){
        const pizza_cart = pizza_factory();
        
        pizza_cart.recordAction('smallz');
        pizza_cart.recordAction('smallz');
        pizza_cart.recordAction('mediumz');
        pizza_cart.recordAction('largee');

        assert.deepEqual({
            smallPizza : 59.80, 
            midPizza : 69.90, 
            largePizza : 100.90, 
            grandTotal : 230.60}, 
            pizza_cart.totals());

    });

    it('should be able to minus and display the right totals', function(){
        const pizza_cart = pizza_factory();
        
        pizza_cart.recordAction('smallz');
        pizza_cart.recordAction('smallz');
        pizza_cart.recordAction('min_small_pizza');

        assert.equal(29.90, pizza_cart.totals().grandTotal);
    });
});