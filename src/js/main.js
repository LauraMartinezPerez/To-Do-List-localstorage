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



// Array inicial de tareas con algunos ejemplos
let tasks = [];
/*  [
    { name: 'Medico el 24/03/25 a las 9:30h', completed: true, id: 1 },
    { name: 'Comprar fruta', completed: true, id: 2 },
    { name: 'Poner una lavadora', completed: true, id: 3 },
    { name: 'Aprender cómo se realizan las peticiones al servidor en JavaScript', completed: false, id: 4 }
];  */

//Localstorage: Guardar en el navegador las tareas añadidas



// Función para guardar las tareas en localStorage
/* const saveTasksToLocalStorage = () => {
    localStorage.setItem("savedTasks", JSON.stringify(tasks)); //convierte el array en JSON en string y lo guarda en localStorage con el nombre "tasks" (clave) y el array de tareas ( tasks);
    
    console.log(typeof JSON.stringify(tasks));
    console.log(JSON.stringify(tasks));
} */

//Funcion para cargar las tareas desde localStorage al iniciar la aplicación
/* const loadTasksFromLocalStorage = () => {
    const savedTasks = localStorage.getItem("savedTasks"); //recoge el array de tareas guardado en localStorage con la clave "tasks"
    if (savedTasks) { //si hay tareas guardadas
        tasks = JSON.parse(savedTasks); //convierte el string JSON de nuevo a un array y lo asigna a la variable tasks
    }
    console.log(typeof JSON.parse(savedTasks));
    console.log(JSON.parse(savedTasks));
}
 */


const renderLoading = () => {
    tasksList.innerHTML = '<li>Cargando tareas...</li>';
};

// Función para pintar todas las tareas en el DOM
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

//1. Añadir nueva tarea

// Función manejadora para añadir nuevas tareas
const handleclickAdd = ev => {
    // Previene el comportamiento por defecto del formulario
    ev.preventDefault();
    // Recoge el texto introducido en el input contemplando espacios en blanco
    const newTaskInputValue = newTaskInput.value.trim();
    // si el valor esta vacio, no añade la tarea y muestra una alerta

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
    const stringTasks = JSON.stringify(tasks); //convierte el array en JSON en string y lo guarda en localStorage
    localStorage.setItem("savedTasks", stringTasks); 

    //Mostrar las tasks guardadas en localStorage al recargar la página
    const savedTasks = localStorage.getItem("savedTasks"); 
    console.log(savedTasks); //recoge el array de tareas guardado en localStorage con la clave "tasks"


/*     const savedTasks = localStorage.getItem("savedTasks"); //recoge el array de tareas guardado en localStorage con la clave "tasks"
    if (savedTasks) { //si hay tareas guardadas
        tasks = JSON.parse(savedTasks); //convierte el string JSON de nuevo a un array y lo asigna a la variable tasks
    } */

    // Actualiza la vista, los contadores y limpia el input
    renderTasks();
    countTasks();
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
    renderTasks();
    countTasks();
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
            renderTasks();
            countTasks();
        }
    }
}

tasksList.addEventListener("click", handleDeleteTask);

//5. Contar tareas pendientes y completadas

// Función para contar tareas pendientes y completadas
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

// Renderiza las tareas iniciales y los contadores al cargar la página
renderTasks();
countTasks();
