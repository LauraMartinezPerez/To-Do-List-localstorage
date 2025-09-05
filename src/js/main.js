'use strict';

//FUNCIONALIDAD

/*
    1. Cuando se haga clic en add, añadir la tarea al array, pintar las tareas y limpiar el input.
    2. Cuando se marque la tarea como completada, tacharla.
    3. Cuando se haga click en search mostrar solo las tareas que contengan el input. 
    4. Cuando se haga click en el icono de cerrar de cada task, borrar la tareas.
    5. Mostrar una frase que indique cuantas tareas hay pendientes y completadas.
*/

const tasksList = document.querySelector('.js-list-task');
const newTaskInput = document.querySelector('.js-new-input');
const addButton = document.querySelector('.add-form__button');
const searchInput = document.querySelector('.js-search-input');
const searchButton = document.querySelector('.js-search-btn');
const xbutton = document.querySelector('.js-x');
const pendingCount = document.querySelector('.js-pending-count');
const completedCount = document.querySelector('.js-completed-count');

const tasks = [
    { name: 'Recoger setas en el campo', completed: true, id: 1 },
    { name: 'Comprar pilas', completed: true, id: 2 },
    { name: 'Poner una lavadora de blancos', completed: true, id: 3 },
    { name: 'Aprender cómo se realizan las peticiones al servidor en JavaScript', completed: false, id: 4 }
];


//Pintar las tareas en la lista

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
            <i class="fa-solid fa-circle-xmark js-x" id="${task.id}"></i>
            <input type="checkbox" id="${task.id}" ${task.completed ? 'checked' : ''}>
            <label class="${task.completed ? 'crossed-out-task' : ''}" for="${task.id}">${task.name}</label>
            </li>`;
    }

    tasksList.innerHTML = list;

}; 

//1. Añadir nueva tarea

 const handleclickAdd = ev => {
    ev.preventDefault();
    const newTaskInputValue = newTaskInput.value;
    tasks.push({ name: newTaskInputValue, completed: false, id: tasks.length + 1 });

    renderTasks();
    countTasks();

    newTaskInput.value = '';
};

addButton.addEventListener('click', handleclickAdd); 

//2. Tachar tarea completada
 
const handleCheckedTask = event => {
    const taskId = parseInt(event.target.id); 

    if (!taskId) return;

    const clickedTask = tasks.find(task => task.id === taskId);

    if (clickedTask) {
        clickedTask.completed = !clickedTask.completed;
    }
    renderTasks();
    countTasks();
};

tasksList.addEventListener('click', handleCheckedTask); 



//3. Buscar tarea

const renderFilteredTasks = (filteredTasks) => {
    let list = '';
    for (const task of filteredTasks) {
        list += `<li>
            <i class="fa-solid fa-circle-xmark js-x" id="${task.id}"></i>
            <input type="checkbox" id="${task.id}" ${task.completed ? 'checked' : ''}>
            <label class="${task.completed ? 'crossed-out-task' : ''}" for="${task.id}">${task.name}</label>
            </li>`;
    }
    tasksList.innerHTML = list;
}

const handleSearchTask = (ev) => {
    ev.preventDefault();
    const searchInputValue = searchInput.value;
    const filteredTasks = tasks.filter(task => 
        task.name.toLowerCase().includes(searchInputValue.toLowerCase())
    );
    
    renderFilteredTasks(filteredTasks);
    countTasks(filteredTasks); 
    searchInput.value = '';
}

searchButton.addEventListener("click", handleSearchTask);

//4. Borrar tarea

const handleDeleteTask = (ev) => {
    // Verifica si el click fue en el botón de eliminar
    if(ev.target.classList.contains("js-x")) {
        // Obtiene el ID de la tarea a eliminar
        const taskId = parseInt(ev.target.id);
        
        // Encuentra el índice de la tarea en el array
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        
        // Si encuentra la tarea, la elimina
        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
            //pinta las tareas y el contador actualizados
            renderTasks();
            countTasks();
        }
    }
}


tasksList.addEventListener("click", handleDeleteTask);

//5. Contar tareas pendientes y completadas

const countTasks = (tasksToCount = tasks) => {
    const completedTasks = tasksToCount.filter(task => task.completed).length;
    const pendingTasks = tasksToCount.filter(task => !task.completed).length;

    completedCount.textContent = completedTasks;
    pendingCount.textContent = pendingTasks;
        if (tasks.length === 0) {
        console.log("No hay tareas en la lista");
    }
}

renderTasks();
countTasks();
