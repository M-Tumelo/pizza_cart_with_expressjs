module.exports = function pizza_factory(){
    let small_pizza_counter = 0;
    let medium_pizza_counter = 0;
    let large_pizza_counter = 0;

    let actionList = [];
    function getCounter() {
        return {
           small: small_pizza_counter,
           medium: medium_pizza_counter,
           large: large_pizza_counter
        }
    }
    function recordAction(action) {

        let cost = 0;
        if (action === 'small'){
            cost = 29.90;
            small_pizza_counter++;
        }
        else if (action === 'medium'){
            cost = 69.90;
            medium_pizza_counter++;
        }
        else if (action === 'large'){
            cost = 100.90;
            large_pizza_counter++;
        }
        else if (action === 'min_small_pizza'){
            if(small_pizza_counter > 0) 
            {
                cost = -29.90
                small_pizza_counter--;
            }
        }
        else if (action === 'min_mid_pizza'){
            if(medium_pizza_counter>0) 
            {
                cost = -69.90;
                medium_pizza_counter--;
            }
        }
        else if (action === 'min_large_pizza'){
            if(large_pizza_counter>0) 
            {
                cost = -100.90;
                large_pizza_counter--;
            }
        }
        actionList.push({
            type: action,
            cost
        });
    }
    function getTotal(type) {
        let total = 0;
        // loop through all the entries in the action list 
        for (let index = 0; index < actionList.length; index++) {
            const action = actionList[index];
            // check this is the type we are doing the total for 
            if (action.type === type) {
                // if it is add the total to the list
                total += action.cost;
            }
        }
        return total;
    }
    function grandTotal() {
        var tot =(getTotal('small') + getTotal('min_small_pizza')+getTotal('medium')+getTotal('min_mid_pizza')+getTotal('large')+getTotal('min_large_pizza')).toFixed(2);
   if(tot< 0) return 0.00;
   else return tot;
    }

    function totals() {
        let smallPizza =  (getTotal('small') + getTotal('min_small_pizza')).toFixed(2);
        let midPizza = (getTotal('medium')+getTotal('min_mid_pizza')).toFixed(2);
        let largePizza = (getTotal('large')+getTotal('min_large_pizza')).toFixed(2);

        if(smallPizza < 0) {
            smallPizza = 0.00;
        }
        if(midPizza < 0) {
            midPizza = 0.00;
        }
        if(largePizza < 0) {
            largePizza = 0.00;
        }
        return {
            smallPizza,
            midPizza,
            largePizza,
            grandTotal : grandTotal()
        }
      
    }
    return {
        recordAction,
        totals,
        getCounter
    }
}
