// Setting Up Variables
const theInput = document.querySelector(".add-task input");
const theAddButton = document.querySelector(".add-task .plus");
const tasksContainer = document.querySelector(".tasks-content");
const tasksCount = document.querySelector(".tasks-count span");
const tasksCompleted = document.querySelector(".tasks-completed span");
const deleteAllButton = document.querySelector(".delete-all");
const finishAllButton = document.querySelector(".finish-all");

// Load Tasks from Local Storage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => addTaskToDOM(task.text, task.finished));
  calculateTasks();
}

// Save Tasks to Local Storage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll('.tasks-content .task-box').forEach(taskBox => {
    tasks.push({
      text: taskBox.querySelector('.task-text').textContent,
      finished: taskBox.classList.contains('finished')
    });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Check if Task Already Exists
function taskExists(text) {
  const taskTexts = Array.from(document.querySelectorAll('.tasks-content .task-text')).map(el => el.textContent.trim().toLowerCase());
  return taskTexts.includes(text.trim().toLowerCase());
}

// Adding The Task
theAddButton.onclick = function () {
  const taskText = theInput.value.trim();
  
  if (taskText === '') {
    alert("Please enter a task.");
    return;
  }
  
  if (taskExists(taskText)) {
    alert("This task already exists.");
    theInput.value = '';
    return;
  }
  
  addTaskToDOM(taskText);
  theInput.value = '';
  saveTasks();
};

// Add Task to DOM
function addTaskToDOM(text, finished = false) {
  let noTasksMsg = document.querySelector(".no-tasks-message");
  
  if (noTasksMsg) {
    noTasksMsg.remove();
  }

  let mainSpan = document.createElement("span");
  mainSpan.className = 'task-box';
  if (finished) mainSpan.classList.add('finished');

  let actionsDiv = document.createElement("div");
  actionsDiv.className = 'actions';

  let editElement = document.createElement("span");
  editElement.className = 'edit';
  editElement.textContent = 'Edit';

  let deleteElement = document.createElement("span");
  deleteElement.className = 'delete';
  deleteElement.textContent = 'Delete';

  let textElement = document.createElement("span");
  textElement.className = 'task-text';
  textElement.textContent = text;

  actionsDiv.appendChild(editElement);
  actionsDiv.appendChild(deleteElement);
  
  mainSpan.appendChild(textElement);
  mainSpan.appendChild(actionsDiv);

  tasksContainer.appendChild(mainSpan);
  calculateTasks();
}

// Delete Task
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('delete')) {
    e.target.parentNode.parentNode.remove();
    if (tasksContainer.childElementCount === 0) {
      createNoTasks();
    }
    saveTasks();
  }

  if (e.target.classList.contains('task-box')) {
    e.target.classList.toggle("finished");
    saveTasks();
  }

  if (e.target.classList.contains('edit')) {
    const taskBox = e.target.parentNode.parentNode;
    const taskText = taskBox.querySelector('.task-text');
    const newText = prompt("Edit task:", taskText.textContent);
    if (newText && !taskExists(newText)) {
      taskText.textContent = newText;
      saveTasks();
    } else if (newText) {
      alert("This task already exists.");
    }
  }

  calculateTasks();
});

// Create No Tasks Message
function createNoTasks() {
  let msgSpan = document.createElement("span");
  msgSpan.className = 'no-tasks-message';
  msgSpan.textContent = "No Tasks To Show";
  tasksContainer.appendChild(msgSpan);
}

// Calculate Tasks
function calculateTasks() {
  tasksCount.textContent = document.querySelectorAll('.tasks-content .task-box').length;
  tasksCompleted.textContent = document.querySelectorAll('.tasks-content .finished').length;
}

// Delete All Tasks
deleteAllButton.onclick = function () {
  tasksContainer.innerHTML = '';
  createNoTasks();
  localStorage.removeItem('tasks');
  calculateTasks();
};

// Finish All Tasks
finishAllButton.onclick = function () {
  document.querySelectorAll('.tasks-content .task-box').forEach(taskBox => taskBox.classList.add('finished'));
  saveTasks();
};

// Initialize
window.onload = function () {
  theInput.focus();
  loadTasks();
};
