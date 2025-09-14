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

const overlayAlert = document.querySelector('.js-overlay-alert');
const overlayErrorMessage = document.querySelector('.js-overlay-error-message');
const overlayClose = document.querySelector('.js-overlay-close');

//Muestra una alerta personalizada
const showOverlayError = (message) => {
    overlayErrorMessage.textContent = message;
    overlayAlert.style.display = "flex";
    newTaskInput.value = '';
};
//Cierra al hacer click en el botón
const hideOverlayError = () => {
    overlayAlert.style.display = "none";
};
overlayClose.addEventListener('click', hideOverlayError);
//Cerrar al hacer click en cualquier parte del overlay
const handleCloseOverlay = (e) => {
    if (e.target === overlayAlert) {
        hideOverlayError();
    }
};
overlayAlert.addEventListener("click", handleCloseOverlay);



// Array inicial de tareas
let tasks = [];
/*  [
    { name: 'Medico el 24/03/25 a las 9:30h', completed: true, id: 1 },
    { name: 'Comprar fruta', completed: true, id: 2 },
    { name: 'Poner una lavadora', completed: true, id: 3 },
    { name: 'Aprender cómo se realizan las peticiones al servidor en JavaScript', completed: false, id: 4 }
];  */

//Funciones de LocalSotorage

// Función para guardar las tareas en localStorage
 const saveTasks = () => {
    localStorage.setItem("savedTasks", JSON.stringify(tasks)); //convierte el array en JSON en string y lo guarda en localStorage con el nombre "tasks" (clave) y el array de tareas ( tasks);
    
    console.log(typeof JSON.stringify(tasks));
    console.log(JSON.stringify(tasks));
} 

//Funcion para cargar las tareas desde localStorage al iniciar la aplicación
const loadTasks = () => {
    const savedTasks = JSON.parse(localStorage.getItem("savedTasks"));
    if (savedTasks) {
        tasks = savedTasks;
    }
}
 
//Renderizado de tareas

// Renderiza un mensaje de carga mientras se obtienen las tareas

const renderLoading = () => {
    tasksList.innerHTML = '<li>Cargando tareas...</li>';
};

// Renderizar todas las tareas en el DOM
 const renderTasks = () => {
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
     for (const task of tasks) {
        list += `<li>
            <i class="fa-solid fa-circle-xmark js-x" id="${task.id}"></i>
            <input type="checkbox" id="${task.id}" ${task.completed ? 'checked' : ''}>
            <label class="${task.completed ? 'crossed-out-task' : ''}" for="${task.id}">${task.name}</label>
            </li>`;
    }
    // Inserta todo el HTML generado en el contenedor de tareas
    tasksList.innerHTML = list;
}; 

// Renderiza tareas filtradas
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

//Funciones de eventos

// Añadir nueva tarea
const handleclickAdd = ev => {
    ev.preventDefault();
    // Recoge el texto introducido en el input contemplando espacios en blanco
    const newTaskInputValue = newTaskInput.value.trim();
    // si el valor esta vacio, no añade la tarea y muestra una alerta
    if (newTaskInputValue === "") {
        showOverlayError("No se puede añadir una tarea vacia.");
        return;
    }
    // Genera un ID único encontrando el ID máximo actual y sumando 1
    const maxId = Math.max(...tasks.map(task => task.id), 0);
    const newId = maxId + 1;
    // Añade la nueva tarea al array
    tasks.push({ 
        name: newTaskInputValue, 
        completed: false, 
        id: newId 
    });

    // Guarda las tareas actualizadas en localStorage
    saveTasks();
    // Actualiza la vista, los contadores y limpia el input
    renderTasks();
    countTasks();
    newTaskInput.value = '';
};
addButton.addEventListener('click', handleclickAdd); 


// Marcar/desmarcar tareas como completadas
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
     // Guarda las tareas actualizadas en localStorage y actualiza la vista y los contadores
    saveTasks();
    renderTasks();
    countTasks();
};

tasksList.addEventListener('click', handleCheckedTask); 


//Buscar tarea
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

searchButton.addEventListener("click", handleSearchTask);

//Borrar tarea
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
            // Guarda las tareas actualizadas en localStorage y actualiza la vista y los contadores
            saveTasks();
            renderTasks();
            countTasks();
        }
    }
}

tasksList.addEventListener("click", handleDeleteTask);


// Contar tareas pendientes y completadas
const countTasks = (tasksToCount = tasks) => {
    // Cuenta tareas completadas y pendientes
    const completedTasks = tasksToCount.filter(task => task.completed).length;
    const pendingTasks = tasksToCount.filter(task => !task.completed).length;
    // Actualiza los contadores en el DOM
    completedCount.textContent = completedTasks;
    pendingCount.textContent = pendingTasks;
        if (tasks.length === 0) {
        // Avisa en consola si no hay tareas
        console.log("No hay tareas en la lista");
    }
}

// Inicialización
loadTasks();                // Carga tareas guardadas al arrancar
renderTasks();              // Muestra tareas en pantalla
countTasks();               // Actualiza contadores
