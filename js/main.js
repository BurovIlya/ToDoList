
const form = document.getElementById('form');

const taskInput = form.querySelector('.form-control');

const tasksList = document.getElementById('tasksList');

let tasks = [];

form.addEventListener('submit', addTask);

tasksList.addEventListener('click', deleteTask);

tasksList.addEventListener('click', doneTask);

if (localStorage.getItem('myTasks')) {
    tasks = JSON.parse(localStorage.getItem('myTasks'));
    
    tasks.forEach(function(item) {
        createTask(item);
    });
} else {
    checkEmptyList();
}

function createTask(taskObject) {
    
    let cssClass = taskObject.done ? 'task-title task-title--done' : 'task-title';
    let taskHTML = `<li id="${taskObject.id}" class="list-group-item d-flex justify-content-between task-item">
    <span class="${cssClass}">${taskObject.text}</span>
    <div class="task-item__buttons">
        <button type="button" data-action="done" class="btn-action">
            <img src="./img/tick.svg" alt="Done" width="18" height="18">
        </button>
        <button type="button" data-action="delete" class="btn-action">
            <img src="./img/cross.svg" alt="Done" width="18" height="18">
        </button>
    </div>
</li>`;

    tasksList.insertAdjacentHTML("beforeend", taskHTML);
    checkEmptyList();

}

function addTask (e) {
    e.preventDefault();

    let taskText = taskInput.value;

    let newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    };

    tasks.push(newTask);
    
    createTask(newTask);
    
    taskInput.value = "";
    taskInput.focus();

    saveToStorage();

    
    
}

function deleteTask (e) {
    let target = e.target;
    if ( target.dataset.action != 'delete' ) {
        return;    
    }

    let listItem = target.closest('.list-group-item');
    let listItemId = listItem.id;
    let deletedTaskIndex = tasks.findIndex((item) => item.id == listItemId);
    tasks.splice(deletedTaskIndex, 1);

    //2-й способ удалить из массива
    //tasks = tasks.filter((task) => task.id !== listItemId);
    
    listItem.remove();

    checkEmptyList();

    if(tasks.length == 0) {
        localStorage.clear();
    } else {
        saveToStorage();
    }
    
        
}

function doneTask (e) {
    let target = e.target;
    if ( target.dataset.action != 'done' ) {
        return;    
    }

    let listItem = target.closest('.list-group-item');
    let taskTitle = listItem.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');

    let listItemId = listItem.id;
    let doneTask = tasks.find((item) => item.id == listItemId);
    doneTask.done = !doneTask.done;

    saveToStorage();

}

function checkEmptyList () {
    if (tasks.length == 0) {
        const emptyListElement = `<li id="emptyList" class="list-group-item empty-list">
        <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
        <div class="empty-list__title">Список дел пуст</div>
    </li>`;

        tasksList.insertAdjacentHTML('afterbegin', emptyListElement);

    }

    if (tasks.length > 0) {
        let emptyListEl = tasksList.querySelector('.empty-list');
        
        if(emptyListEl) {
            emptyListEl.remove();
        } 
    }

}


function saveToStorage() {
    localStorage.setItem('myTasks', JSON.stringify(tasks));
}