var form = document.getElementById("form");
var taskInput = document.getElementById("taskName");
var projectInput = document.getElementById("projectName");
var allTasks = [];
var displayedTasks = [];
var upadteIndex = -1;

// Load tasks from local storage
if (localStorage.getItem("allTasks") !== null) {
  allTasks = JSON.parse(localStorage.getItem("allTasks"));
  displayedTasks = [...allTasks]; // Create a copy for initial display
  displayTasks(displayedTasks);
}

function addNewTask() {
  var taskName = taskInput.value.trim(); // Remove leading and trailing whitespaces
  var projectName = projectInput.value;

  // Basic input validation
  if (!taskName) {
    alert("Please enter a task name.");
    return;
  }

  if (projectName === "Choose The Project") {
    alert("Please choose a project.");
    return;
  }

  var task = {
    name: taskName,
    project: projectName,
  };

  allTasks.push(task);
  saveTasks();
  displayedTasks = [...allTasks];
  clearForm();
  displayTasks(displayedTasks);
}

function showForm() {
  form.classList.remove("d-none");
}

function clearForm() {
  taskInput.value = "";
  projectInput.value = "";
}

function displayTasks(array) {
  var tbody = document.getElementById("tbody");
  tbody.innerHTML = ""; // Clear the table body
  if (array.length !== 0) {
    array.forEach((task, i) => {
      var isChecked = task.done ? "checked" : ""; // Check if the task is done

      // Use <del> tag if the task is done
      var taskName = task.done ? `<del>${task.name}</del>` : task.name;
      var projectName = task.done ? `<del>${task.project}</del>` : task.project;

      tbody.innerHTML += `<tr>
        <td class="align-middle">
          <input type="checkbox" name="" id="${i}" onchange="toggleDone(${i})" ${isChecked} />
        </td>
        <td class="align-middle">
          ${taskName}
        </td>
        <td class="align-middle">${projectName}</td>
        <td class="align-middle">
          <button class="btn btn-warning" onclick="updateTask(${i})" ${
        task.done ? "disabled" : ""
      }>Update</button>
        </td>
        <td class="align-middle">
          <button class="btn btn-danger" onclick="deleteTask(${i})" ${
        task.done ? "disabled" : ""
      }>Delete</button>
        </td>
      </tr>`;
    });
  } else {
    tbody.innerHTML = "<tr><td colspan='5'>No tasks found.</td></tr>";
  }
}

// Function to toggle the "done" status of a task
function toggleDone(index) {
  allTasks[index].done = !allTasks[index].done;

  // If task is done, move it to the end of the array
  if (allTasks[index].done) {
    var doneTask = allTasks.splice(index, 1)[0];
    allTasks.push(doneTask);
  }

  saveTasks();
  displayedTasks = [...allTasks];
  displayTasks(displayedTasks);
}

function saveTasks() {
  localStorage.setItem("allTasks", JSON.stringify(allTasks));
}

function deleteTask(index) {
  if (index < displayedTasks.length) {
    // Display a confirmation dialog
    var confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    // Proceed with deletion if the user confirms
    if (confirmDelete) {
      var originalIndex = allTasks.indexOf(displayedTasks[index]);
      allTasks.splice(originalIndex, 1);
      displayedTasks = [...allTasks];
      saveTasks();
      displayTasks(displayedTasks);
    }
  }
}

function updateTask(index) {
  document.getElementById("addBtn").classList.add("d-none");
  document.getElementById("updateBtn").classList.remove("d-none");
  taskInput.value = displayedTasks[index].name;
  projectInput.value = displayedTasks[index].project;
  upadteIndex = allTasks.indexOf(displayedTasks[index]);

  // Remove the d-none class from the form
  form.classList.remove("d-none");
}

function updateProcess() {
  if (upadteIndex !== -1) {
    allTasks[upadteIndex].name = taskInput.value;
    allTasks[upadteIndex].project = projectInput.value;
    displayedTasks = [...allTasks];
    saveTasks();
    displayTasks(displayedTasks);
    document.getElementById("addBtn").classList.remove("d-none");
    document.getElementById("updateBtn").classList.add("d-none");
    clearForm();
  }
}

function searchAndHideForm(term) {
  displayedTasks = allTasks.filter((t) =>
    t.name.toLowerCase().includes(term.toLowerCase())
  );
  displayTasks(displayedTasks);

  // Add the d-none class to hide the form
  form.classList.add("d-none");
}
