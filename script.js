const form = document.querySelector(".form");
const task = document.getElementById("task");
const alert = document.querySelector(".alert");
const addBtn = document.querySelector(".add-btn");
const clearBtn = document.querySelector(".clear-btn");

const empty = document.querySelector(".empty");
const itemContainer = document.querySelector(".item-container");

let editFlag = false;
let editId = "";
let editElement = "";

form.addEventListener("submit", addTask);

clearBtn.addEventListener("click", clearTasks);

window.addEventListener("DOMContentLoaded", setup);

function addTask(e) {
  e.preventDefault();
  const value = task.value;
  const id = new Date().getTime().toString();
  if (value && !editFlag) {
    createTaskList(id, value);

    alertFunction("Task added", "success");
    clearBtn.classList.add("active");
    empty.classList.remove("show");
    addToLocalStorage(id, value);
    setBackToDefault();
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    alertFunction("Task edited", "success");
    editLocalStorage(editId, value);
    setBackToDefault();
  } else {
    alertFunction("Please enter a task", "danger");
  }
}

function alertFunction(text, action) {
  alert.textContent = text;
  alert.classList.add(action);
  setTimeout(function () {
    alert.classList.remove(action);
  }, 1500);
}

function clearTasks() {
  const items = itemContainer.querySelectorAll(".task-list");

  if (items.length > 0) {
    items.forEach(function (item) {
      itemContainer.removeChild(item);
    });
    alertFunction("Tasks cleared", "danger");
    clearBtn.classList.remove("active");
    setBackToDefault;
    localStorage.removeItem("task-list");
  }
}

function editTask(e) {
  const item = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling;

  task.value = editElement.innerHTML;
  editFlag = true;
  editId = item.dataset.id;
  addBtn.textContent = "save task";
}

function removeTask(e) {
  const item = e.currentTarget.parentElement.parentElement;
  const id = item.dataset.id;
  itemContainer.removeChild(item);
  if (itemContainer.children.length === 0) {
    clearBtn.classList.remove("active");
    empty.classList.add("show");
  }
  alertFunction("Task removed", "danger");
  setBackToDefault();
  removeFromStorage(id);
}

function setBackToDefault() {
  task.value = "";
  editFlag = false;
  editId = "";
  addBtn.textContent = "add task";
}

function addToLocalStorage(id, value) {
  const task = { id, value };
  let items = getLocalStorage();

  items.push(task);
  localStorage.setItem("task-list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("task-list", JSON.stringify(items));
}
function removeFromStorage(id) {
  let items = localStorage;
  items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("task-list", JSON.stringify(items));
}
function getLocalStorage() {
  return localStorage.getItem("task-list")
    ? JSON.parse(localStorage.getItem("task-list"))
    : [];
}

function setup() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(function (item) {
      createTaskList(item.id, item.value);
    });
    clearBtn.classList.add("active");
    empty.classList.remove("show");
  }
}

function createTaskList(id, value) {
  itemContainer.innerHTML += `<div class="task-list" data-id=${id}>
          <p class="task">${value}</p>
          <div class="btns">
            <button class="edit-btn">edit</button>
            <button class="remove-btn">remove</button>
          </div>
        </div>`;
  const editBtn = itemContainer.querySelector(".edit-btn");
  const removeBtn = itemContainer.querySelector(".remove-btn");

  editBtn.addEventListener("click", editTask);
  removeBtn.addEventListener("click", removeTask);
}
