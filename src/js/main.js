'use strict';

//FUNCIONALIDAD

/*
    1. Cuando se haga clic en add pintar las tareas.
    2. Mostrar una frase que indique cuantas tareas hay pendientes.
    3. Cuando se haga click en search mostrar solo las tareas que contengan. 
    4. Cuando se haga click en el icono de cerrar de cada task, borrar la tareas.
    5. Cuando se marque la tarea como completada, tacharla.
*/

const tasksList = document.querySelector(".js-list-task");
const newTask = document.querySelector(".js-new-task");
const addButton = document.querySelector(".add-form__button");


const tasks = [
  { name: "Recoger setas en el campo", completed: true, id: 1 },
  { name: "Comprar pilas", completed: true, id: 2 },
  { name: "Poner una lavadora de blancos", completed: true, id: 3 },
  { name: "Aprender cómo se realizan las peticiones al servidor en JavaScript", completed: false, id: 4,},
];

//1. Añadir nueva tarea

const renderTasks = () => {
/*     let list = "";
    for (const task of tasks) {
        list += `<li class="list__task task">
                    <i class="fa-solid fa-circle-xmark"></i>
                    <input class="task__checkbox" type="checkbox" id="task-${task.id}" ${task.completed ? "checked" : ""}>
                    <label class="task__label ${task.completed ? "task__label--completed" : ""}" for="task-${task.id}">${task.name}</label>
                </li>`;
    }
    tasksList.innerHTML = list; */

    let list = "";
    for (const task of tasks) {
        list += `<li>
                    <i class="fa-solid fa-circle-xmark js-x" id="task-1"></i>   
                    <input type="checkbox" id="task-${task.id}" ${task.completed ? "checked" : ""}>
                    <label class="" for="task-${task.id}">${task.name}</label>
                </li>`;
    }
    tasksList.innerHTML = list;

}
const handleclickAdd = (ev) => {
    ev.preventDefault();
    const newTaskValue = newTask.value;
    const addTask = tasks.push({name: newTaskValue, completed: false, id: tasks.length + 1});
    renderTasks();
    newTask.value = "";
}


addButton.addEventListener("click", handleclickAdd);

/*
1. Cuando se haga clic en add pintar las tareas:
    - traer la ul, el input y el boton
    - cuando se haga click en el boton:
        - recoger el valor del input
        - añadir el input al array de tareas
        - pintar las tareas en la ul
        - limpiar el input
*/


