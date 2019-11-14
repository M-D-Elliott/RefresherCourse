// initializes app by creating base todo.
function init() {
  addTodo(createNewTodo("Set up some todos!", randomIntFromInterval(0, 7)));
  // addTodo(createNewTodo("Set up some todos!", randomIntFromInterval(0, 7)));
  // addTodo(createNewTodo("Set up some todos!", randomIntFromInterval(0, 7)));
  resetTodoForm();
}

// ****app functions****
function createNewTodo(task, days) {
  var template = document.getElementById("todo-template");
  var todo = template.cloneNode(true);
  todo.removeAttribute("id");
  const urgency = getTodoUrgency(days);
  todo.className = "todo " + urgency;
  todo.querySelector('.todo-task').innerHTML = task;
  todo.querySelector('.todo-days').innerHTML = pluralize(days, "day");
  todo.setAttribute("days", parseInt(days));
  return todo;
}

function addTodo(todo) {
  const todo_list = document.getElementById("todo-list");
  todo_list.appendChild(todo);
  DOYPSort(todo_list, ".todo", "days", "L");
}

// -------Form events----------
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

function resetTodoForm() {
  const form = getTodoForm();
  clearErrors(form);
  const task_field = form["task"];
  const date_field = form["date"];
  let days_field = form["days"];
  resetPositiveIntegerField(days_field);
  date_field.value = dateToString(today());
  task_field.focus();
}

function resetPositiveIntegerField(field) {
  field.value = field.value >= 0
    ? field.value
    : 1;
}

function setDaysFieldByDate(date) {
  days_field = getTodoForm()["days"];
  days_field.value = daysBetweenNowAnd(date)
}

function setDateFieldByDays(days) {
  date_field = getTodoForm()["date"];
  date_field.value = dateToString(addDays(today(), parseInt(days)))
}

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

// *******validation helper functions *******
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

function getTodoForm() {
  return document.forms["todo-form"];
}

function getTodoUrgency(days) {
  return (days < 3)
          ? "todo-urgent"
         : (days < 7)
          ? "todo-approaching"
         :
          "todo-standard";
}

// ****utility functions******
function today() {
  return new Date();
}

function dateToString(date) {
  var month = (date.getMonth() + 1);
  var day = date.getDate();
  if (month < 10)
      month = "0" + month;
  if (day < 10)
      day = "0" + day;
  var today = date.getFullYear() + '-' + month + '-' + day;
  return today;
}

function daysBetweenNowAnd(date) {
  const days_constant = 24*3600*1000;
  let date_differential = (date - today());
  const ret = Math.floor(date_differential / days_constant) + 1;
  return ret;
}

function addDays(dateObj, numDays) {
  dateObj.setDate(dateObj.getDate() + numDays);
  return dateObj;
}

function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function capitalizeFirstLetter(string)
{
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function pluralize(count, noun, suffix = 's') {
  return `${count} ${noun}${count !== 1 ? suffix : ''}`;
}

function getClosestElement (elem, selector) {
	for ( ; elem && elem !== document; elem = elem.parentNode ) {
		if ( elem.matches( selector ) ) return elem;
	}
	return null;
};

function closeThisElementParent(elem, parentClass) {
  getClosestElement(elem, parentClass).remove();
}

function DOYPSort(wrapper, elementtosort, AttrToSort, orderof) {
    let elements = Array.from(wrapper.querySelectorAll(elementtosort));
    let sortedChildren = elements.sort(function (a, b) {
        if (orderof === 'H') {
            return +parseInt(b.getAttribute(AttrToSort)) - +parseInt(a.getAttribute(AttrToSort));
        }
        if (orderof === 'L') {
            return +parseInt(a.getAttribute(AttrToSort)) - +parseInt(b.getAttribute(AttrToSort));
        }
    });
    wrapper.emptyElement();
    wrapper.appendChildren(sortedChildren);
}

Node.prototype.emptyElement = function() {
  while (this.firstChild) {
    this.firstChild.remove();
  }
}

Node.prototype.appendChildren = function(arrayOfNodes) {
  var length = arrayOfNodes.length;
  for (var i = 0; i < length; i++) {
    this.appendChild(arrayOfNodes[i]);
  }
};
