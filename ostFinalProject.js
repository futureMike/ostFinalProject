function Todo(id, task, who, dueDate) {
    this.id = id;
    this.task = task;
    this.who = who;
    this.dueDate = dueDate;
    this.done = false;
}

var todos = new Array();

window.onload = init;

function init() {
    var submitButton = document.getElementById("submit");
    submitButton.onclick = getFormData;

    getTodoItems();
}

function getTodoItems() {
    if (localStorage) {
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            if (key.substring(0, 4) == "todo") {
                var item = localStorage.getItem(key);
                var todoItem = JSON.parse(item);
                todos.push(todoItem);
            }
        }
        addTodosToPage();
    }
    else {
        console.log("Error: you don't have localStorage!");
    }
}

function addTodosToPage() {
    var ul = document.getElementById("todoList");
    var listFragment = document.createDocumentFragment();
    for (var i = 0; i < todos.length; i++) {
        var todoItem = todos[i];
        var li = createNewTodo(todoItem);
        listFragment.appendChild(li);
    }
    ul.appendChild(listFragment);
}
function addTodoToPage(todoItem) {
    var ul = document.getElementById("todoList");
    var li = createNewTodo(todoItem);
    ul.appendChild(li);
    document.forms[0].reset();
}

function createNewTodo(todoItem) {
    var li = document.createElement("li");
    li.setAttribute("id", todoItem.id);
    var spanTodo = document.createElement("span");
    spanTodo.innerHTML =
        todoItem.who + " needs to " + todoItem.task + " by " + todoItem.dueDate;
    var todoTTL  = getTTL(todoItem.dueDate);      
    var spanTTL  = document.createElement("span");
    if(todoTTL.toLocaleString() < 0){
    spanTTL.innerHTML = 
    	"This task is "+todoTTL.toLocaleString()+" days overdue";
    	spanTTL.style.backgroundColor = "red";
    	} else {
    
    spanTTL.innerHTML = 
    	" You have "+ todoTTL.toLocaleString() +" days left to complete this todo item! ";
    	}
    
    

    var spanDone = document.createElement("span");
    if (!todoItem.done) {
        spanDone.setAttribute("class", "notDone");
        spanDone.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp";
    }
    else {
        spanDone.setAttribute("class", "done");
        spanDone.innerHTML = "&nbsp;&#10004;&nbsp;";
        
    }
    
    var spanDelete = document.createElement("span");
    
    spanDelete.setAttribute("class", "delete");
    spanDelete.innerHTML = "&nbsp;&#10007;&nbsp;";

    spanDelete.onclick = deleteItem;
    spanDone.onclick = updateDone;

    li.appendChild(spanDone);
    li.appendChild(spanTodo);
    li.appendChild(spanTTL);
    li.appendChild(spanDelete);
    
    return li;
}

function getTTL(derp){

var ddMillis = Date.parse(derp);
        var now = new Date();
        var diff = ddMillis - now.getTime();
        var ttl = Math.floor(diff / 1000 / 60 / 60 / 24);
        alert("ttl is: "+ttl.toLocaleString());
        return ttl;
}

function updateDone(){
	//if conditional testing class attribute, and toggling to opposite of current class
	if (this.getAttribute("class") == "notDone"){
	this.setAttribute("class", "done");
	this.innerHTML = "&nbsp;&#10004;&nbsp;";
	//change done status in todos
	for (var x in todos){
		if(todos[x].id = this.parentNode.id){
			todos[x].done = true;
			//alert done status to verify...
			//alert("todo array status: "+todos[x].done);
			}
			
		}
	//create and test localStorage key
	var key = "todo"+this.parentNode.id;
	console.log(key);
	//update localStorage
	var item = localStorage.getItem(key);
	var parsedItem = JSON.parse(item);
	parsedItem.done = true;
	newItem = JSON.stringify(parsedItem);
	//ensure I stringified correctly..
	//alert(newItem);
	localStorage.setItem(key, newItem);
	
	
	} else {
	this.setAttribute("class", "notDone");
	this.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp";
	//change done status in todos
	for (var x in todos){
		if(todos[x].id = this.parentNode.id){
			todos[x].done = false;
			//alert done status to verify
			//alert("todos array status: "+todos[x].done);
			}
		}
	//create and test localStorage key
	var key = "todo"+this.parentNode.id;
	console.log(key);
	//update localStorage
	var item = localStorage.getItem(key);
	var parsedItem = JSON.parse(item);
	parsedItem.done = false;
	newItem = JSON.stringify(parsedItem);
	//alert(newItem);
	localStorage.setItem(key, newItem)
	}
	

}

             
function getFormData() {
    var task = document.getElementById("task").value;
    if (checkInputText(task, "Please enter a task")) return;

    var who = document.getElementById("who").value;
    if (checkInputText(who, "Please enter a person to do the task")) return;

    var date = document.getElementById("dueDate").value;
    if (checkInputText(date, "Please enter a due date")) return;
    
    var id = (new Date()).getTime();
    var todoItem = new Todo(id, task, who, date);
    todos.push(todoItem);
    addTodoToPage(todoItem);
    saveTodoItem(todoItem);
}





function checkInputText(value, msg) {
    if (value == null || value == "") {
        alert(msg);
        return true;
    }
    return false;
}

function saveTodoItem(todoItem) {
    if (localStorage) {
        var key = "todo" + todoItem.id;
        var item = JSON.stringify(todoItem);
        localStorage.setItem(key, item);
    }
    else {
        console.log("Error: you don't have localStorage!");
    }
} 

function deleteItem(e) {
    var span = e.target;
    var id = span.parentElement.id;
    console.log("delete an item: " + id);

    // find and remove the item in localStorage
    var key = "todo" + id;
    localStorage.removeItem(key);

    // find and remove the item in the array
    for (var i = 0; i < todos.length; i++) {
        if (todos[i].id == id) {
            todos.splice(i, 1);
            break;
        }
    }

    // find and remove the item in the page
    var li = e.target.parentElement;
    var ul = document.getElementById("todoList");
    ul.removeChild(li);
}


function searchWho(){
	
	var whoValue = document.getElementById('whoSearch').value;
	whoValue = whoValue.trim();
	var re = new RegExp(whoValue, "ig");
	var results = [];
	for (var x = 0 ; x < todos.length; x++){ 
		if (todos[x].who.match(re)){ 
		
		alert("HEY!!! THIS MATCHED!!! "+todos[x].who+" "+todos[x].task);
	        var toPush = "WOOO it MATCHED THIS: "+todos[x].who+" needs to "+todos[x].task;
		results.push(toPush);
		
		}	
	
	}
	printResults(results);
	
	
}


function searchTask(){
	
	var taskValue = document.getElementById('taskSearch').value;
	taskValue = taskValue.trim();
	var re = new RegExp(taskValue, "ig");
	var results = [];
	for (var x = 0 ; x < todos.length; x++){ 
		if (todos[x].task.match(re)){ 
		
		alert("HEY!!! THIS MATCHED!!! "+todos[x].who+" "+todos[x].task);
	        var toPush = "WOOO it MATCHED THIS: "+todos[x].who+" needs to "+todos[x].task;
		results.push(toPush);
		
		}	
	
	}
	printResults(results);
	
	
}

function printResults(results){ 

var ul = document.getElementById("searchResults");
unPrintResults(ul);
var frag = document.createDocumentFragment();
for (var x = 0; x < results.length; x++){

	var li = document.createElement('li');
	li.innerHTML = results[x];
	frag.appendChild(li);
		}
	ul.appendChild(frag);

	

}

function unPrintResults(ul){
while(ul.firstChild){
	ul.firstChild.parentNode.removeChild(ul.firstChild);
	}
}





