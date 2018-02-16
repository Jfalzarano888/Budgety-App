/*let budgetController = (function() {
  let x = 23;

  let add = function(a) {
    return x + a;
  }
  return {
    publicTest: function(b) {
      return add(b);
    }
  }
})();

let UIcontroller = (function(){
  // some code
})();

let controller = (function(budgetCtrl, UICtrl){
  let z = budgetCtrl.publicTest(5);

  return {
    anotherPublic: function() {
      console.log(z);
    }
  }
})(budgetController, UIcontroller);

* Just some code to give an example of how modular coding works and how to help code not overlap and cause crashes. This also exemplifies how this keeps code closed off from other written code, but can still be used and return values and interact with other written code.
*/

let budgetController = (function() {
  let Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1; // when someting is not defined we use -1
  };

  Expense.prototype.calcPercentage = function(totalIncome){
    if(totalIncome > 0 ){
      this.percentage = Math.round((this.value / totalIncome) * 100); // its important to have these methods written correctly. I spent 10 minutes trying to figure out why percentages were not showing for a later task and it was becuase I missed some paranthesis for this part of my code. FUCK ME

    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };
  // some code
  let Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  let calculateTotal = function(type) {
    let sum = 0;
    data.allItems[type].forEach(function(e){
      sum += e.value;
    });
     data.totals[type] = sum;
  }

  let data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  return {
    addItem: function(type, des, val) {
      let newItem, Id;
      // create new Id
      if (data.allItems[type].length > 0) {
      Id = data.allItems[type][data.allItems[type].length - 1].id + 1
    } else {
      Id = 0;
    }
      // creating new item based on 'inc' or 'exp' type
      if (type === 'exp') {
        newItem = new Expense (Id, des, val)
      } else if (type === 'inc') {
        newItem = new Income (Id, des, val)
      }
      // push it into our data structure
      data.allItems[type].push(newItem);
      //return the new element
      return newItem;
    },

    deleteItem: function(type, id) {
      let ids, index;
      //id = 6
      //data.allItems[type][id]
      //ids = [1,2,4,6,8]
      // index = 3
      // if we wanted to delete item 6, we would have to get the index of the number 6 which is 3 (they are not 1 to 1). Below we use the map method to attatch a fixed id to each of those numbers regardless if they get deleted.
       ids = data.allItems[type].map(function(e){
        return e.id;
      });

      index = ids.indexOf(id); // look up indexOf -- return the index number of the element of the array that we input here.

      if (index !== -1) {
        data.allItems[type].splice(index, 1); // this will start removing elements at the number index and will only remove 1 item.
      }
    },

    calculateBudget: function() {
      // calculate total income and expenses.
      calculateTotal('exp');
      calculateTotal('inc');
      // calculate the budget: income - the expenses__list
      data.budget = data.totals.inc - data.totals.exp;
      //calculate the percentage of income that we spent
      data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },

    calculatePercentages: function() {
      /*
      a = 20
      b = 10
      c = 40
      income = 100
      a=20/100 = 20%
      b=10/100 = 10%
      c=40/100 = 40%
      */

      data.allItems.exp.forEach(function(e){
        e.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function() {
      let allPerc = data.allItems.exp.map(function(e){
        return e.getPercentage();
      });
      return allPerc;
    },

    testing: function () {
      console.log(data);
    }
  };

})();


// GLOBAL USER EXPERIENCE CONTROLLER
let UIcontroller = (function(){
  // by putting all the dom manipulated elements inside an object literal, if someone decides to go back and change the names of all the classes, all you have to do is change the object literal containing all of the values instead of changing everything individually.
  let domStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercentageLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  };

  let formatNumber = function(num, type) {
    let numSplit, int, dec;
    /* plus or minus before the number exactly 2 decimal points with a comma separating the thousands*/

    num = Math.abs(num); // this removes the sign of the number
    num = num.toFixed(2) // this is a method of the number prototype. this allows you to be fixed to 2 decimal points on the numbers on which numbers that are called. if there a no decimals it will add .00 to the whole number.

    numSplit = num.split('.') // this will split the number into an array of strings with one part of the number before the decimal and one part after.

    int = numSplit[0];
    if(int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
    }

    dec = numSplit[1];

    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
  };

  let nodeListForEach = function(list, callback) {
    for(var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  return {
    getInput: function(){
      return {
        type: document.querySelector(domStrings.inputType).value, // will be either "inc" or "exp" because those were the values assigned to it in the HTML.
        description: document.querySelector(domStrings.inputDescription).value,
        value: parseFloat(document.querySelector(domStrings.inputValue).value)
        //parseFloat alows us to have decimals and also converts the string to a number
      };
    },

    addListItems: function (obj, type) {
      let html, newHtml, element;
      // create HTML string with placeholder text
      if (type === 'inc') {
      element = domStrings.incomeContainer;
      html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div> ';
    } else if (type === 'exp') {
      element = domStrings.expenseContainer;
      html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
    }
      // replace the plaecholder text with some actual data
        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%description%', obj.description);
        newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
      // insert the HTML into the DOM.
       document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    deleteListItem: function(selectorID) {
      let el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },

    clearFields: function () {
      let fields, fieldsArray;
      fields = document.querySelectorAll(domStrings.inputDescription + ', ' + domStrings.inputValue);

      fieldsArray = Array.prototype.slice.call(fields);
      fieldsArray.forEach(function(e){
        e.value = '';
      });

      fieldsArray[0].focus(); // this focuses the description field after putting an input of a value.
    },

    displayBudget: function(obj) {
      let type;

      obj.budget > 0 ? type = 'inc' : type = 'exp'; // ternery conditional to figure out type

      document.querySelector(domStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(domStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(domStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

      if (obj.percentage > 0 ) {
            document.querySelector(domStrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(domStrings.percentageLabel).textContent = '----'
      }
    },

    displayPercentages: function(percentages){

      let fields = document.querySelectorAll(domStrings.expensesPercentageLabel);

      nodeListForEach(fields, function(current, index){

        if (percentages[index] > 0 ) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '---';
        }
      });
    },

    displayMonth: function() {
      let now, year, currentMonth, allMonths;
      now = new Date();

      allMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      currentMonth = now.getMonth();
      year = now.getFullYear(); // this is going to return the year.
      document.querySelector(domStrings.dateLabel).textContent = allMonths[currentMonth] + ' ' + year;

    },

    changeType: function() {

      let fields = document.querySelectorAll(
        domStrings.inputType + ',' +
        domStrings.inputDescription + ',' +
        domStrings.inputValue
      );

      nodeListForEach(fields, function(e) {
        e.classList.toggle('red-focus');
      });

      document.querySelector(domStrings.inputBtn).classList.toggle('red');

    },

    getdomStrings: function(){
      return domStrings;
    }
  }
  // some code
})();


//  GLOBAL APP CONTROLLER
let controller = (function(budgetCtrl, UICtrl){

  let setupEventListeners = function (){
      let OGdomstrings = UICtrl.getdomStrings();
      document.querySelector(OGdomstrings.inputBtn).addEventListener('click', ctrlAddItem);
      // some code
      document.addEventListener('keypress', function(e){
        if (e.keyCode === 13) {
          ctrlAddItem();
        }
      });

      document.querySelector(OGdomstrings.container).addEventListener('click', ctrlDeleteItem);

      document.querySelector(OGdomstrings.inputType).addEventListener('change', UICtrl.changeType);
    };

  let updateBudget = function() {
    //1. calculate budget
      budgetCtrl.calculateBudget();
    //2. return the budget
      let budget = budgetCtrl.getBudget();

    //3. display the budget on the UI
      UICtrl.displayBudget(budget);
  };

  let updatePercentages = function(){
    // 1. calculate the percentages
        budgetCtrl.calculatePercentages();
    // 2. read percentages from the budget controller
      let percentages = budgetCtrl.getPercentages();
    // 3. update the user interface with the new percentages.
      UICtrl.displayPercentages(percentages);

      console.log(percentages);
  };


  let ctrlAddItem = function() {
    let input, newItem;
    // 1. get field input data
       input = UICtrl.getInput()
    // 2. add the item to the budget budgetController
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
       newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    // 3. add the new item to the user interface
      UICtrl.addListItems(newItem, input.type);
    // 4. clear the fields after an input (inc or exp) is added
      UICtrl.clearFields();
    // 5. calculate and update the budget
      updateBudget();
    // 6. calculate and update percentages
      updatePercentages();
    //console.log('it works');
    }
  };

    let ctrlDeleteItem = function(event){
      let itemId, splitId, type, Id;

      itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
      if (itemId) {
        splitId = itemId.split('-'); // this allows us to split a string and seperate it into an array. then we can grab each item in the array seperately.
        type = splitId[0];
        Id = parseInt(splitId[1]);

        // 1. delete the item from the data structure
        budgetCtrl.deleteItem(type, Id);
        // 2. delete the item from the UI
        UICtrl.deleteListItem(itemId);
        // 3. update and show the new budget
        updateBudget();

        // 4. calculate and update percentages
        updatePercentages();

      }
    };

    return {
      init: function () {
        console.log('application has started');
        UICtrl.displayMonth();
        UICtrl.displayBudget({
          budget: 0,
          totalInc: 0,
          totalExp: 0,
          percentage: -1
        });
        setupEventListeners();
      }
    };

})(budgetController, UIcontroller);

controller.init();
