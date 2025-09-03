'use strict';

//FUNCIONALIDAD

/*
    1. Cuando se haga clic en add, añadir la tarea al array, pintar las tareas y limpiar el input.
    2. Cuando se marque la tarea como completada, tacharla.
    3. Cuando se haga click en search mostrar solo las tareas que contengan el input. 
    4. Cuando se haga click en el icono de cerrar de cada task, borrar la tareas.
    5. Mostrar una frase que indique cuantas tareas hay pendientes.
*/

const tasksList = document.querySelector('.js-list-task');
const newTaskInput = document.querySelector('.js-new-input');
const addButton = document.querySelector('.add-form__button');
const searchInput = document.querySelector('.js-search-input');
const searchButton = document.querySelector('.js-search-btn');

const tasks = [
    { name: 'Recoger setas en el campo', completed: true, id: 1 },
    { name: 'Comprar pilas', completed: true, id: 2 },
    { name: 'Poner una lavadora de blancos', completed: true, id: 3 },
    { name: 'Aprender cómo se realizan las peticiones al servidor en JavaScript', completed: false, id: 4 }
];


//1. Añadir nueva tarea

 const renderTasks = () => {
    let list = '';
 
    /*     CONDICINAL SIMPLE:
    for (const task of tasks) {
        let isChecked = "";
        let completedClass = "";
        if (task.completed === true) {
            isChecked = "checked";
            completedClass = "crossed-out-task";
        }
    list += `<li>
            <i class="fa-solid fa-circle-xmark js-x" id="${task.id}""></i>   
            <input type="checkbox" id="${task.id}" ${isChecked}>
            <label class="${completedClass}" for="${task.id}">${task.name}</label>
        </li>`;
    } */

     for (const task of tasks) {
        list += `<li>
            <i class="fa-solid fa-circle-xmark js-x" id="corss-${task.id}"></i>
            <input type="checkbox" id="${task.id}" ${task.completed ? 'checked' : ''}>
            <label class="${task.completed ? 'crossed-out-task' : ''}" for="${task.id}">${task.name}</label>
            </li>`;
    }

    tasksList.innerHTML = list;
}; 

 const handleclickAdd = ev => {
    ev.preventDefault();
    const newTaskInputValue = newTaskInput.value;
    const addTask = tasks.push({ name: newTaskInputValue, completed: false, id: tasks.length + 1 });

    renderTasks();
    newTaskInput.value = '';
};

addButton.addEventListener('click', handleclickAdd); 

//2. Tachar tarea completada
 
const handleCheckedTask = event => {
    const taskId = parseInt(event.target.id); // ID del elemento clicado

    if (!taskId) return;

    const clickedTask = tasks.find(task => task.id === taskId);

    if (clickedTask) {
        clickedTask.completed = !clickedTask.completed;
    }
    renderTasks();
};

tasksList.addEventListener('click', handleCheckedTask); 

renderTasks();

//3. Buscar tarea

 

const handleSearchTask = (ev) => {
    ev.preventDefault();
    const searchInputValue = searchInput.value;
    const filterTasks = (task) => {
        /*  console.log(task); */
        return task.name.toLowerCase().includes(searchInputValue.toLowerCase());
    }

    const filteredTasks = tasks.filter(filterTasks);
    /* console.log(filteredTasks); */
    const renderFilteredTasks = () => {
        let list = '';
        for (const filteredTask of filteredTasks) {
            list += `<li>
                <i class="fa-solid fa-circle-xmark js-x" id="corss-${filteredTask.id}"></i>
                <input type="checkbox" id="${filteredTask.id}" ${filteredTask.completed ? 'checked' : ''}>
                <label class="${filteredTask.completed ? 'crossed-out-task' : ''}" for="${filteredTask.id}">${filteredTask.name}</label>
                </li>`;
        }
        tasksList.innerHTML = list;
    };
    renderFilteredTasks();
}

searchButton.addEventListener("click", handleSearchTask);

