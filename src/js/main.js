'use strict';

// Selecciona elementos del DOM necesarios para la aplicación
const tasksList = document.querySelector('.js-list-task');
const newTaskInput = document.querySelector('.js-new-input');
const addButton = document.querySelector('.add-form__button');
const searchInput = document.querySelector('.js-search-input');
const searchButton = document.querySelector('.js-search-btn');
const xbutton = document.querySelector('.js-x');
const pendingCount = document.querySelector('.js-pending-count');
const completedCount = document.querySelector('.js-completed-count');

//Variables para almacenar la información del usuario de github y la url del endpoint
const gitHubUser = "LauraMartinezPerez";
const serverUrl = `https://dev.adalab.es/api/todo/${gitHubUser}`;
const serverUrlTodo = "https://dev.adalab.es/api/todo";

// Array inicial de tareas con algunos ejemplos
let tasks = [];
/* [
    { name: 'Medico el 24/03/25 a las 9:30h', completed: true, id: 1 },
    { name: 'Comprar fruta', completed: true, id: 2 },
    { name: 'Poner una lavadora', completed: true, id: 3 },
    { name: 'Aprender cómo se realizan las peticiones al servidor en JavaScript', completed: false, id: 4 }
]; */

//Conexión con servidor para cargar y guardar tareas
// Añade esta constante con tus otras constantes
const loadingOverlay = document.querySelector('.js-loading-overlay');

// Añade estas funciones para controlar el overlay
const showLoading = () => {
    loadingOverlay.classList.add('visible');
};

const hideLoading = () => {
    loadingOverlay.classList.remove('visible');
};

// Modifica tu función fetchTasks
const fetchTasks = () => {
    showLoading(); // Muestra el overlay
    renderLoading(); // Mantén esto si quieres mostrar también el mensaje en la lista
    
    fetch(serverUrlTodo)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            tasks = data.results;
            renderTasks(tasks);
            countTasks(tasks);
            hideLoading(); // Oculta el overlay al terminar
        })
        .catch(error => {
            console.error('Error al cargar las tareas:', error);
            renderError('Error al cargar las tareas. Por favor, inténtalo de nuevo más tarde. 🙁');
            tasks = [];
            countTasks(tasks);
            hideLoading(); // Oculta el overlay incluso si hay error
        });
}

const renderError = (errorMessage) => {
    tasksList.innerHTML = `
        <li class="error-message">
            <i class="fa-solid fa-circle-exclamation"></i>
            ${errorMessage}
        </li>`;
};

const renderLoading = () => {
    tasksList.innerHTML = '<li>Cargando tareas...</li>';
};

// Función para pintar todas las tareas en el DOM
 const renderTasks = (tasksToRender) => {
    // Inicializa string vacío para ir concatenando el HTML
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

    // Recorre el array de tareas y genera el HTML para cada una
     for (const task of tasksToRender) {
        list += `<li>
            <i class="fa-solid fa-circle-xmark js-x" id="${task.id}"></i>
            <input type="checkbox" id="${task.id}" ${task.completed ? 'checked' : ''}>
            <label class="${task.completed ? 'crossed-out-task' : ''}" for="${task.id}">${task.name}</label>
            </li>`;
    }
    // Inserta todo el HTML generado en el contenedor de tareas
    tasksList.innerHTML = list;

}; 

//1. Añadir nueva tarea

// Función manejadora para añadir nuevas tareas
const handleclickAdd = ev => {
    // Previene el comportamiento por defecto del formulario
    ev.preventDefault();
    // Recoge el texto introducido en el input
    const newTaskInputValue = newTaskInput.value;
    // Genera un ID único encontrando el ID máximo actual y sumando 1
    const maxId = Math.max(...tasks.map(task => task.id), 0);
    const newId = maxId + 1;
    // Añade la nueva tarea al array
    tasks.push({ 
        name: newTaskInputValue, 
        completed: false, 
        id: newId 
    });
    // Actualiza la vista, los contadores y limpia el input
    renderTasks(tasks);
    countTasks(tasks);
    newTaskInput.value = '';
};

addButton.addEventListener('click', handleclickAdd); 

//2. Tachar tarea completada
 
// Función manejadora para marcar/desmarcar tareas como completadas
const handleCheckedTask = event => {
    // Convierte el ID de string a número
    const taskId = parseInt(event.target.id); 
    // Si no hay ID válido, sale de la función
    if (!taskId) return;
    // Busca la tarea clickada en el array
    const clickedTask = tasks.find(task => task.id === taskId);
    // Invierte su estado. Si esta completada, la marca como no completada y viceversa
    if (clickedTask) {
        clickedTask.completed = !clickedTask.completed;
    }
     // Actualiza la vista y los contadores
    renderTasks(tasks);
    countTasks(tasks);
};

tasksList.addEventListener('click', handleCheckedTask); 


//3. Buscar tarea

// Función manejadora para buscar tareas
const handleSearchTask = (ev) => {
    ev.preventDefault();
     // Obtiene el valor del texto de búsqueda
    const searchInputValue = searchInput.value;
    // Filtra las tareas que contengan el texto sin hacer distinción de mayúsculas/minúsculas
    const filteredTasks = tasks.filter(task => 
        task.name.toLowerCase().includes(searchInputValue.toLowerCase())
    );
    // Muestra las tareas filtradas, actualiza contadores y limpia el input
    renderFilteredTasks(filteredTasks);
    countTasks(filteredTasks); 
    searchInput.value = '';
}

// Función para mostrar tareas filtradas
const renderFilteredTasks = (filteredTasks) => {
     // Similar a renderTasks pero usando el array filtrado
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
            renderTasks(tasks);
            countTasks(tasks);
        }
    }
}

tasksList.addEventListener("click", handleDeleteTask);

//5. Contar tareas pendientes y completadas

// Función para contar tareas pendientes y completadas
const countTasks = (tasksToCount) => {
    // Cuenta tareas completadas y pendientes
    const completedTasks = tasksToCount.filter(task => task.completed).length;
    const pendingTasks = tasksToCount.filter(task => !task.completed).length;
    // Actualiza los contadores en el DOM
    completedCount.textContent = completedTasks;
    pendingCount.textContent = pendingTasks;
        if (tasksToCount.length === 0) {
        // Avisa en consola si no hay tareas
        console.log("No hay tareas en la lista");
    }
}

// Renderiza las tareas iniciales y los contadores al cargar la página
fetchTasks();



localStorage.setItem("tasks", "tareas");

const tarea = localStorage.getItem("tasks");

