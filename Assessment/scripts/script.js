// initializes app by creating base todo.
function init() {
  addTodo("Set up some todos!", randomIntFromInterval(0, 7));
  resetTodoForm();
}

// ****app functions****

function addTodo(task, days) {
  var todo_list = document.getElementById("todo-list");
  var template = document.getElementById("todo-template");
  var todo = template.cloneNode(true);
  todo.removeAttribute("id");
  const urgency = getTodoUrgency(days);
  todo.className = "todo " + urgency;
  todo.querySelector('.todo-task').innerHTML = task;
  todo.querySelector('.todo-days').innerHTML = pluralize(days, "day");
  todo_list.appendChild(todo);
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
  if(
      validatePositiveIntegerField(daysField, "days")
  )
  {
      let task = taskField.value;
      let days = daysField.value;
      // let days = daysBetweenNowAnd(dateField.valueAsDate);
      addTodo(task, days);
  }
}

// *******validation helper functions *******
function validatePositiveIntegerField(field, nameOfField) {
    var value = parseInt(field.value);
    if (field.value === "" || isNaN(field.value)) {
        alert(capitalizeFirstLetter(nameOfField) + " must be a number.");
        field.isValid = false;
        field.focus();
        return false;
    }
    if (value < 0) {
      alert("You can't have negative " + nameOfField.toLowerCase() + "!");
      field.isValid = false;
      field.focus();
      return false;
    }
    return true;
}

// ****Helper functions****

function getTodoForm() {
  return document.forms["todo-form"];
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

function getTodoUrgency(days) {
  return (days < 3)
          ? "todo-urgent"
         : (days < 7)
          ? "todo-approaching"
         :
          "todo-standard";
}

function getClosestElement (elem, selector) {
	for ( ; elem && elem !== document; elem = elem.parentNode ) {
		if ( elem.matches( selector ) ) return elem;
	}
	return null;
};

function closeThisElementParent(elem, parentClass) {
  getClosestElement(elem, parentClass).remove();
  return false;
}
