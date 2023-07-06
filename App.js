
// Retrieve tasks from local storage or initialize an empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Function to save tasks to local storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ! Function to render tasks in the respective task section
function renderTasks() {
    // Clear task lists
    document.getElementById('open').innerHTML = '';
    document.getElementById('in-progress').innerHTML = '';
    document.getElementById('in-review').innerHTML = '';
    document.getElementById('done').innerHTML = '';

    // Render tasks in respective sections
    tasks.forEach((task) => {
        const taskElement = createTaskElement(task);
        const taskList = document.getElementById(task.state);
        taskList.appendChild(taskElement);
    });
}

// ! Function to create a task element
function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task';
    taskElement.draggable = true;
    taskElement.id = task.id;

    const taskTag = document.createElement('div');
    taskTag.className = 'tag';
    taskElement.appendChild(taskTag);

    const taskTitle = document.createElement('h3');
    taskTitle.textContent = task.title;
    taskElement.appendChild(taskTitle);

    const taskDescription = document.createElement('pre');
    taskDescription.textContent = task.description;
    taskElement.appendChild(taskDescription);

    const taskEditButton = document.createElement('button');
    taskEditButton.className = 'edit-btn'
    taskEditButton.innerHTML = '&#9998;';
    taskElement.appendChild(taskEditButton);

    // Event listener for task click to open modal for editing/deleting
    taskEditButton.addEventListener('click', () => {
        openEditModal(task);
    });

    // Event listeners for drag and drop events on task element
    taskElement.addEventListener('dragstart', handleDragStart);
    taskElement.addEventListener('dragend', handleDragEnd);

    return taskElement;
}

// ! Function to open the add task modal
function openAddTaskModal() {
    const modal = document.getElementById('add-task-modal');
    modal.style.display = 'block';

    // Event listener for close button in add task modal
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    const titleInput = document.getElementById('task-title');
    titleInput.focus();

    // Event listener for submit button in add task modal
    const submitBtn = document.getElementById('submit-task-btn');
    submitBtn.addEventListener('click', () => {
        if (!titleInput.value.trim()) return;
        const descriptionInput = document.getElementById('task-description');

        const newTask = {
            id: Date.now(),
            title: titleInput.value,
            description: descriptionInput.value,
            state: 'open'
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();

        titleInput.value = '';
        descriptionInput.value = '';

        modal.style.display = 'none';
    });
}

// ! Function to open the edit task modal
function openEditModal(task) {
    const modal = document.getElementById('edit-task-modal');
    modal.style.display = 'block';

    // Set task details in the modal inputs
    const titleInput = modal.querySelector('#edit-task-title');
    titleInput.value = task.title;

    const descriptionInput = modal.querySelector('#edit-task-description');
    descriptionInput.value = task.description;

    // Event listener for close button in edit task modal
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Event listener for update button in edit task modal
    const updateBtn = modal.querySelector('#update-task-btn');
    updateBtn.addEventListener('click', () => {
        console.log('submitted');
        task.title = titleInput.value;
        task.description = descriptionInput.value;
        saveTasks();
        renderTasks();
        modal.style.display = 'none';
    });

    // Event listener for delete button in edit task modal
    const deleteBtn = modal.querySelector('#delete-task-btn');
    deleteBtn.addEventListener('click', () => {
        tasks = tasks.filter((t) => t.id !== task.id);
        saveTasks();
        renderTasks();
        modal.style.display = 'none';
    });
}

// ! Function to handle drag start event
function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', this.id);
    this.classList.add('dragging');
}

// ! Function to handle drag over event
function handleDragOver(event) {
    event.preventDefault();
}

// ! Function to handle drag enter event
function handleDragEnter() {
    this.classList.add('drag-over');
}

// ! Function to handle drag leave event
function handleDragLeave() {
    this.classList.remove('drag-over');
}

// ! Function to handle drop event
function handleDrop(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text/plain');
    const newTaskState = this.id;
    const task = tasks.find((t) => t.id === parseInt(taskId));

    if (task) {
        task.state = newTaskState;
        saveTasks();
        renderTasks();
    }

    this.classList.remove('drag-over');
}

// Function to handle drag end event
function handleDragEnd() {
    this.classList.remove('dragging');
}

// ! Function to add event listeners
function addEventListeners() {
    const taskLists = document.getElementsByClassName('task-list');
    Array.from(taskLists).forEach((taskList) => {
        taskList.addEventListener('dragover', handleDragOver);
        taskList.addEventListener('dragenter', handleDragEnter);
        taskList.addEventListener('dragleave', handleDragLeave);
        taskList.addEventListener('drop', handleDrop);
    });

    // Event listener for add task icon
    const addTaskIcon = document.querySelector('.add-task-icon');
    addTaskIcon.addEventListener('click', openAddTaskModal);
}

// ! Render initial tasks and add Event Listeners
window.onload = () => {
    renderTasks();
    addEventListeners()
}
