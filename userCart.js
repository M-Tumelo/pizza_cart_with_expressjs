const shopping_cart = require('./factory_function');

module.exports = function pizzaCart(){
   const cart = {};
   function getCart(name){
       if(!cart[name]) cart[name] = shopping_cart();
       return cart[name];
   }
   return{
       getCart
   }
}