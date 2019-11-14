// **********global variables***********
const exampleTodos = [
  "Set up some todos.",
  "You can do this.",
  "The clock is ticking!",
  "Welcome to Bootstrap.",
  "Close me!",
  "Thank you for using our Todo service.",
  "Hello, Dev10!",
  "Shout-out to Gen10!",
]

// ****app functions****

// initializes app by creating base todos.
function init(count) {
  if(!count) {
    count = 1;
  }
  while(count) {
    createExampleTodo();
    count--
  }
  resetTodoForm();
}

// creates new todo element from task and day data.
function createNewTodo(task, days) {
  var template = document.getElementById("todo-template");
  var todo = template.cloneNode(true);
  todo.removeAttribute("id");
  const urgency = getTodoUrgency(days);
  todo.className = "todo " + urgency;
  todo.querySelector('.todo-task').innerHTML = task;
  todo.querySelector('.todo-days').innerHTML = "day".pluralize(days);
  todo.setAttribute("days", parseInt(days));
  return todo;
}

// adds a todo element to the todo list.
function addTodo(todo) {
  const todoList = document.getElementById("todo-list");
  todoList.appendChild(todo.cloneNode(true));
  todoList.DOYPSort(".todo", "days", "L");
}

// -------Form events----------
//removes errors from the passed in form.
function clearErrors(form) {
  var formElements = form.elements;
  var formElementsLength = formElements.length;
  for (var loopCounter = 0;
    loopCounter < formElementsLength;
    loopCounter++) {
    var element = formElements[loopCounter];
    if (!element.isValid) {
      element.isValid = true;
    }
  }
}

// resets the todo form specifically.
function resetTodoForm() {
  const form = getTodoForm();
  clearErrors(form);
  const taskField = form["task"];
  const dateField = form["date"];
  let daysField = form["days"];
  resetPositiveIntegerField(daysField);
  resetDateField(dateField);
  taskField.focus();
}

// sets the days field by the date string passed in.
function setDaysFieldByDate(date) {
  daysField = getTodoForm()["days"];
  daysField.value = date.daysBetweenThisAndNow();
}

//sets the date field by the days string passed in.
function setDateFieldByDays(days) {
  dateField = getTodoForm()["date"];
  // dateField.value = dateToString(addDays(today(), parseInt(days)))
  dateField.value = today().addDays(parseInt(days)).toStringYYYYMMDD();
}

//validates form and creates todo from form fields.
function validateTodo() {
  var form = getTodoForm();
  clearErrors(form);

  var taskField = form["task"];
  var daysField = form["days"];
  // var dateField = form["date"];

  validatePositiveIntegerField(daysField, "days");

  if(
    daysField.isValid &&
    taskField.isValid
  )
  {
      const task = taskField.value;
      const days = parseInt(daysField.value);
      // let days = daysBetweenNowAnd(dateField.valueAsDate);
      const todo = createNewTodo(task, days);
      addTodo(todo);
  }
}

// *******Value validation functions *******
// sets date inputs to today's date.
function resetDateField(field) {
  field.value = today().toStringYYYYMMDD();
}

// sets an integer field to be at least 0.
function resetPositiveIntegerField(field) {
  field.value = field.value >= 0
    ? field.value
    : 0;
}

// sets an integer field to invalid if it is populated with any negative or non-numerical value.
function validatePositiveIntegerField(field, nameOfField) {
  var value = parseInt(field.value);
  if (field.value === "" || isNaN(field.value)) {
      alert(capitalizeFirstLetter(nameOfField) + " must be a number.");
      field.isValid = false;
      field.focus();
  }
  if (value < 0) {
    alert("You can't have negative " + nameOfField.toLowerCase() + "!");
    field.isValid = false;
    field.focus();
  }
}

// ****Helper functions****
// gets the todo form from the dom.
function getTodoForm() {
  return document.forms["todo-form"];
}

// retrieves the urgency of a todo based on number of days.
function getTodoUrgency(days) {
  return (days < 3)
          ? "todo-urgent"
         : (days < 7)
          ? "todo-approaching"
         :
          "todo-standard";
}

// creates an example todo randomly selected from the examples repository.
function createExampleTodo() {
  const exampleTodo =
    createNewTodo(exampleTodos.randomEntry(), (7).randomPositive());
  addTodo(exampleTodo);
}

// ****utility functions******
// retrieves a datetime object containing today's date.
function today() {
  return new Date();
}

// ***Object extending functions***

// gets a random integer between this and an optional minimum.
Number.prototype.randomPositive = function(min) { // min and max included
  if(!min) {
    min = 0;
  }
  return Math.floor(Math.random() * (this - min + 1) + min);
}


// converts a datetime object into a string with YYYYMMDD format.
Date.prototype.toStringYYYYMMDD = function() {
  var month = (this.getMonth() + 1);
  var day = this.getDate();
  if (month < 10)
      month = "0" + month;
  if (day < 10)
      day = "0" + day;
  var today = this.getFullYear() + '-' + month + '-' + day;
  return today;
}

// gets the number of days between now and the supplied datetime object.
Date.prototype.daysBetweenThisAndNow = function() {
  const days_constant = 24*3600*1000;
  let date_differential = (this - new Date());
  const ret = Math.floor(date_differential / days_constant) + 1;
  return ret;
}


//adds a number of days to a datetime object.
Date.prototype.addDays = function(numDays) {
  this.setDate(this.getDate() + numDays);
  return this;
}

// returns boolean of whether or this string has a value.
String.prototype.isEmpty = function() {
  return (this.length === 0 || !this.trim());
};

// capitalizes first letter of a string
String.prototype.capitalizeFirstLetter = function()
{
  return this.charAt(0).toUpperCase() + this.slice(1);
}

// pluralizes a string based on supplied count.
String.prototype.pluralize = function(count, suffix = 's') {
  return `${count} ${this}${count !== 1 ? suffix : ''}`;
}

// gets a random entry from an array.
Array.prototype.randomEntry = function() {
  return this[Math.floor(Math.random()*this.length)];
}

// gets the closest parent of this node with option to include selector.
Node.prototype.getClosestParent = function(selector) {
  if (typeof selector !== 'string' || !(selector instanceof String))
    selector = "";
  if(selector.isEmpty()) {
    return this.parentNode;
  } else {
    for ( ; elem && elem !== document; elem = elem.parentNode ) {
      if ( elem.matches( selector ) ) return elem;
    }
  }
  return null;
}

// removes parent of this node, removing this node and all siblings as well.
Node.prototype.removeParent = function(identifier) {
  this.getClosestParent(identifier).remove();
}

//removes all child nodes from node.
Node.prototype.emptyElement = function() {
  while (this.firstChild) {
    this.firstChild.remove();
  }
}

//appends an array of elements to a node.
Node.prototype.appendChildren = function(arrayOfNodes) {
  var length = arrayOfNodes.length;
  for (var i = 0; i < length; i++) {
    this.appendChild(arrayOfNodes[i]);
  }
};

//sorts the object in a parent node by attribute.
Node.prototype.DOYPSort = function(elementtosort, AttrToSort, orderof) {
    let elements = Array.from(this.querySelectorAll(elementtosort));
    let sortedChildren = elements.sort(function (a, b) {
        if (orderof === 'H') {
            return +parseInt(b.getAttribute(AttrToSort)) - +parseInt(a.getAttribute(AttrToSort));
        } else {
            return +parseInt(a.getAttribute(AttrToSort)) - +parseInt(b.getAttribute(AttrToSort));
        }
    });
    this.emptyElement();
    this.appendChildren(sortedChildren);
}
