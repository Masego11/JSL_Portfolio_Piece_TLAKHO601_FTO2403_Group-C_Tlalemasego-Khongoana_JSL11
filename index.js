// TASK: import helper functions from utils
import { getTasks, createNewTask, patchTask, putTask, deleteTask} from "./utils/taskFunctions.js"; //imported task functions
import { initialData } from "./initialData.js"; //imported initial data 
// TASK: import initialData


/*************************************************************************************************************************************************
 * FIX BUGS!!!
 * **********************************************************************************************************************************************/

// Function checks if local storage already has data, if not it loads initialData to localStorage
function initializeData() {
  if (!localStorage.getItem("tasks")) {
    localStorage.setItem("tasks", JSON.stringify(initialData)); 
    localStorage.setItem("showSideBar", "true"); // added missing colon and changed to double quotation marks for consitency
  } else {
    console.log("Data already exists in localStorage");
  }
}

// TASK: Get elements from the DOM
const elements = {
  themeSwitch: document.getElementById("switch"), // to attach an eventlistener that toggles between dark and light mode
  hideSideBarBtn: document.getElementById("hide-side-bar-btn"),// to attach an event listener that hides the sidebar
  showSideBarBtn: document.getElementById("show-side-bar-btn"), //to attach an event listener that displays the sidebar 
  headerBoardName: document.getElementById("header-board-name"), // to update the board name displayed in the header when switching from on board to another 
  columnDivs :document.querySelectorAll(".column-div"), //to update the tasks lists within each column
  modalWindow: document.querySelector(".modal-window"), // to toggle the visibility of the add new task when creating new tasks 
  filterDiv: document.getElementById("filterDiv"), // to show or hide the overlay filter when modals are open 
  addNewTaskBtn: document.getElementById("add-new-task-btn"), // to attach an event listener that opens the add new task window
  editTaskModalWindow: document.querySelector(".edit-task-modal-window"), // to toggle the task modal when editing existing tasks 
  newTaskModalWindow: document.getElementById("new-task-modal-window"), // to add modal window 
  tasksContainer: document.querySelectorAll(".tasks-container"), // a list of elements with the class task-container holding task items
  editBoardBtn: document.getElementById("edit-board-btn"), //to open the board editing options
  deleteBoardBtn: document.getElementById("deleteBoardBtn"), // to delete the current board 
  sideBarDiv: document.getElementById("side-bar-div"), // the div element that represents the the sidebar of the application
  layout: document.getElementById("layout"), // element representing the main layout container
  switchCheckbox: document.getElementById("switch"), // toggle switch for switching themes
  createTaskBtn: document.getElementById("create-task-btn"), // button for creating new task
  editTaskForm: document.getElementById("edit-task-form"), // form used for editing existing tasks
  cancelEditBtn: document.getElementById("cancel-edit-btn"), // button that cancels the edit operation
  cancelAddTaskBtn: document.getElementById("cancel-add-task-btn"), // button that cancels adding a new task
  titleInput: document.getElementById("title-input"),  // input field for entering a new task title
  descriptionInput: document.getElementById("desc-input"), // input field for entering a task description
  selectStatus: document.getElementById("select-status"), // element for choosing the status of a new task
  editTitleInput: document.getElementById("edit-task-title-input"), // input field for editing the title of an existing task
  editDescInput: document.getElementById("edit-task-desc-input"), // input field for editing the description of an existing task
  editStatusSelect: document.getElementById("edit-select-status"), // select element for editing the status of an existing task
  saveTaskChangesBtn: document.getElementById("save-task-changes-btn"), // button to save changes made to an existing task
  deleteTaskBtn: document.getElementById("delete-task-btn"), // button to delet existing task
  cancelEditBtn: document.getElementById("cancel-edit-btn"), // button to cancel task editing operation
  boardsNavlinksDiv: document.getElementById("boards-nav-links-div"), // the div containing the navigation boards within the app
  createNewTaskBtn: document.getElementById("create-task-btn"),



}

let activeBoard = ""

// Extracts unique board names from tasks
// TASK: FIX BUGS
function fetchAndDisplayBoardsAndTasks() {
  const tasks = getTasks();
  const boards = [...new Set(tasks.map(task => task.board).filter(Boolean))];
  displayBoards(boards);
  if (boards.length > 0) {
    const localStorageBoard = JSON.parse(localStorage.getItem("activeBoard"))
    activeBoard = localStorageBoard ? localStorageBoard :  boards[0]; // replaced semi-colon with colon in the ternary operator 
    elements.headerBoardName.textContent = activeBoard; // added semi-colon
    styleActiveBoard(activeBoard); // added semi-colon
    refreshTasksUI();
  }
}

// Creates different boards in the DOM
// TASK: Fix Bugs
function displayBoards(boards) {
  const boardsContainer = document.getElementById("boards-nav-links-div");
  boardsContainer.innerHTML = " "; // Clears the container-changed to double quotation for consistency 
  boards.forEach((board) => {  //enclosed the argument in brackets
    const boardElement = document.createElement("button");
    boardElement.textContent = board;
    boardElement.classList.add("board-btn");
    boardElement.addEventListener("click", () => { //added addEventlistener and completed the arrow function 
      elements.headerBoardName.textContent = board;
      filterAndDisplayTasksByBoard(board);
      activeBoard = board; //assigns active board- added semi-colon
      localStorage.setItem("activeBoard", JSON.stringify(activeBoard)); // added semi-colon
      styleActiveBoard(activeBoard); //added semi- colon
    });
    boardsContainer.appendChild(boardElement);
  });

}

// Filters tasks corresponding to the board name and displays them on the DOM.
// TASK: Fix Bugs
function filterAndDisplayTasksByBoard(boardName) {
  const tasks = getTasks(); // Fetch tasks from a simulated local storage function
  const filteredTasks = tasks.filter((task) => task.board === boardName); // added strict equal sign. enclosed the function argument in brackets

  // Ensure the column titles are set outside of this function or correctly initialized before this function runs

  elements.columnDivs.forEach((column) => {   //enclosed the funtion argument in commas
    const status = column.getAttribute("data-status");
    // Reset column content while preserving the column title
    column.innerHTML = `<div class="column-head-div">
                          <span class="dot" id="${status}-dot"></span>
                          <h4 class="columnHeader">${status.toUpperCase()}</h4>
                        </div>`;

    const tasksContainer = document.createElement("div");
    column.appendChild(tasksContainer);

    filteredTasks.filter((task) => task.status === status).forEach((task) => { //enclosed the function arguments in commas  and added strict equal sign
      const taskElement = document.createElement("div");
      taskElement.classList.add("task-div");
      taskElement.textContent = task.title;
      taskElement.setAttribute("data-task-id", task.id); // changed to double quoted commas for consistency

      // Listen for a click event on each task and open a modal
      taskElement.addEventListener("click", () => { //added and event listener
        openEditTaskModal(task);
      });

      tasksContainer.appendChild(taskElement);
    });
  });
}


function refreshTasksUI() {
  filterAndDisplayTasksByBoard(activeBoard);
}

// Styles the active board by adding an active class
// TASK: Fix Bugs
function styleActiveBoard(boardName) {
  document.querySelectorAll(".board-btn").forEach((btn) => { // Corrected spelling for forEach, enclosed functiion with brackets and single quotation commas with double.
    
    if(btn.textContent === boardName) {
      btn.classList.add("active"); //added classList to the add method and a semi-colon and used double quotation
    }
    else {
      btn.classList.remove("active"); //addded classList to the remove method and used double quotation commas
    }
  });
}


function addTaskToUI(task) {
  const column = document.querySelector('.column-div[data-status="${task.status}"]'); 
  if (!column) {
    console.error(`Column not found for status: ${task.status}`);
    return;
  }

  let tasksContainer = column.querySelector(".tasks-container");
  if (!tasksContainer) {
    console.warn(`Tasks container not found for status: ${task.status}, creating one.`);
    tasksContainer = document.createElement("div");
    tasksContainer.className = "tasks-container";
    column.appendChild(tasksContainer);
  }

  const taskElement = document.createElement("div");
  taskElement.className = "task-div";
  taskElement.textContent = task.title; // Modify as needed
  taskElement.setAttribute("data-task-id", task.id);
  
  tasksContainer.appendChild(taskElement); // added an argument to the appendChild method 
}



function setupEventListeners() {
  // Cancel editing task event listener
  const cancelEditBtn = document.getElementById("cancel-edit-btn");
  cancelEditBtn.addEventListener("click", () => { ////added event listener to the arrow function
  toggleModal(false, elements.editTaskModal);
  elements.filterDiv.style.display = "none"; //
});
  // Cancel adding new task event listener
  const cancelAddTaskBtn = document.getElementById("cancel-add-task-btn");
  cancelAddTaskBtn.addEventListener("click", () => {
    toggleModal(false);
    elements.filterDiv.style.display = "none"; // Also hide the filter overlay
  });

  // Clicking outside the modal to close it
  elements.filterDiv.addEventListener("click", () => {
    toggleModal(false, elements.modalWindow); // added elements.modal window
    toggleModal(false, elements.editTaskModal); //
    elements.filterDiv.style.display = "none"; // Also hide the filter overlay
  });

  // Show sidebar event listener
  elements.hideSideBarBtn.addEventListener("click", () => toggleSidebar(false)); // added the addeventlistener method
  elements.showSideBarBtn.addEventListener("click", () => toggleSidebar(true)); // added the addeventlistener method

  // Theme switch event listener
  elements.themeSwitch.addEventListener("change", toggleTheme);

  // Show Add New Task Modal event listener
  elements.addNewTaskBtn.addEventListener("click", () => {
    toggleModal(true);
    elements.filterDiv.style.display = "block"; // Also show the filter overlay
  });

  // Add new task form submission event listener
  elements.modalWindow.addEventListener("submit",  (event) => {
    addTask(event)
  });
}

// Toggles tasks modal
// Task: Fix bugs
function toggleModal(show, modal = elements.modalWindow) {
  modal.style.display = show ? "block" : "none";  //replaced arrowfunction with colon
}

/*************************************************************************************************************************************************
 * COMPLETE FUNCTION CODE
 * **********************************************************************************************************************************************/

function addTask(event) {
  event.preventDefault(); 

  //Assign user input to the task object
    const task = {
      title: document.getElementById("title-input").value,
      description: document.getElementById("desc-input").value,
      status: document.getElementById("select-status").value, 
      board: activeBoard,
 
    };
    const newTask = createNewTask(task);
    if (newTask) {
      addTaskToUI(newTask);
      toggleModal(false);
      elements.filterDiv.style.display = "none"; // Also hide the filter overlay
      event.target.reset();
      refreshTasksUI();
    }
}


function toggleSidebar(show) {
  elements.sideBarDiv.style.display = show ? "block" :"none";
  elements.showSideBarBtn.style.display = show ? "none" : "block"; //sidebar display 

}

function toggleTheme() { //toggle dark theme to light 
  const isLightTheme = elements.themeSwitch.checked;
  document.body.classList.toggle("light-theme", isLightTheme);
  localStorage.setItem("light-theme", isLightTheme ? "enabled" : "disabled");

  const logo = document.getElementById("logo");
  logo.src = isLightTheme ? "./assets/logo-light.svg" : "./assets/logo-dark.svg";

}



function openEditTaskModal(task) {
  // Set task details in modal inputs
elements.editTitleInput.value = task.title;  
elements.editDescInput.value = task.title;
elements.editStatusSelect.value =task.title;  

  // Get button elements from the task modal
const saveTaskChangesBtn = document.getElementById("save-task-changes-btn");
const deleteTaskBtn = document.getElementById("delete-task-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");

  // Call saveTaskChanges upon click of Save Changes button
 saveTaskChangesBtn.addEventListener("click", () => {
  saveTaskChanges(task.id);
  elements.editTaskModalWindow.style.display = "none";
  elements.newTaskModalWindow.style.display = "none";
 })
  // Delete task using a helper function and close the task modal
  deleteTaskBtn.addEventListener("click", () =>  {
    deleteTask(task.id);
    elements.editTaskModalWindow.style.display = "none";
    elements.newTaskModalWindow.style.display = "none";
    refreshTasksUI();
  });
  cancelEditBtn.addEventListener("click", () => {
    elements.editTaskModalWindow.style.display = "none"
});
  toggleModal(true, elements.editTaskModal); // Show the edit task modal
}

function saveTaskChanges(taskId) {
  // Get new user inputs
  // Create an object with the updated task details
  const updatedTask = {
    id: taskId,
    title: elements.editTitleInput.value,
    description: elements.editDescInput.value,
    status: elements.editStatusSelect.value,
    board: activeBoard,
  }

  // Update task using a hlper functoin
 patchTask(updatedTask);

  // Close the modal and refresh the UI to reflect the changes
  elements.editTaskModalWindow.sytle.display = "none";
  refreshTasksUI();
}

/*************************************************************************************************************************************************/

document.addEventListener('DOMContentLoaded', function() {
  initializeData();
  init(); // init is called after the DOM is fully loaded
});

function init() {
  setupEventListeners();
  const showSidebar = localStorage.getItem('showSideBar') === 'true';
  toggleSidebar(showSidebar);
  const isLightTheme = localStorage.getItem('light-theme') === 'enabled';
  document.body.classList.toggle('light-theme', isLightTheme);
  initializeData();
  fetchAndDisplayBoardsAndTasks(); // Initial display of boards and tasks

}