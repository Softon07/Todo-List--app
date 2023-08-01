// New task - variables
const tasks = [];
const newTaskBtn = document.querySelector('.category__new-task');
const newTaskShadow = document.querySelector('.modal-new-task-shadow');
const newTaskModal = document.querySelector('.modal-new-task');
const saveTaskBtn = document.querySelector('.new-task-save-btn');
const closeTaskBtn = document.querySelector('.new-task-close-btn');
const taskName = document.querySelector('#task-name');
const taskDescription = document.querySelector('#task-description');
const importantCheckbox = document.querySelector('#important-checkbox');
const completedCheckbox = document.querySelector('#completed-checkbox');
const tasksBox = document.querySelector('.tasks-box');

// Edit choosen Task - variables 
let taskID = 0;

// Settings - variables
const openSettingsBtn = document.querySelector('.header__gear-icon');
const settingsShadow = document.querySelector('.modal-settings-shadow');
const settingsModal = document.querySelector('.modal-settings');
const authorInput = document.querySelector('.settings-author');
const saveSettingsBtn = document.querySelector('.modal-settings-save-btn');
const closeSettingsBtn = document.querySelector('.modal-settings-close-btn');
const actualAuthor = document.querySelector('.modal-settings__author');

// New Task - functions
const openNewTaskModal = () => {
    newTaskShadow.style.display = 'block';
    newTaskModal.style.display = 'block';
}

const cleanNewTaskModalInputs = () => {
    taskName.value = '';
    taskDescription.value = '';
    importantCheckbox.checked = false;
    completedCheckbox.checked = false;
}

const closeNewTaskModal = () => {
    newTaskShadow.style.display = 'none';
    newTaskModal.style.display = 'none';
    cleanNewTaskModalInputs();
}

// Date for new task:
const getFormattedDate = date => {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    const formattedDate = `${month} ${day}${getDaySuffix(day)} ${year} ${hours}:${minutes}${ampm}`;
    return formattedDate;
}

const getDaySuffix = day => {
    if (day >= 11 && day <= 13) {
        return 'th';
    }
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

const currentDate = new Date();
const taskDate = getFormattedDate(currentDate);

const addNewTask = () => {
    taskID++;

    taskName.textContent = taskName.value;
    taskDescription.textContent = taskDescription.value;
    const newTask = document.createElement('div');
    newTask.classList.add('task');
    newTask.setAttribute('id', taskID);

    newTask.innerHTML = `
    <div class="task__status-box"><i class="fa-regular fa-square task__icon"></i></div>
    <div class="task__info">
        <p class="task__date">${taskDate}</p>
        <p class="task__name">${taskName.textContent}</p>
        <p class="task__description">${taskDescription.textContent}</p>
        <p class="task__author">${actualAuthor.textContent}</p>
    </div>
    `;

    const taskStatusBox = newTask.querySelector('.task__status-box');
    if (completedCheckbox.checked || (completedCheckbox.checked && importantCheckbox.checked)) {
        taskStatusBox.innerHTML = '<i class="fa-regular fa-square-check task__icon"></i>';
        const divDone = document.createElement('div');
        divDone.classList.add('done');
        newTask.appendChild(divDone);
    } else if (importantCheckbox.checked && !completedCheckbox.checked) {
        taskStatusBox.innerHTML = '<i class="fa-solid fa-exclamation task__icon"></i>';
    }

    tasks.push(newTask);
    updateTasksView();
    closeNewTaskModal();
    cleanNewTaskModalInputs();
}

const updateTasksView = () => {
    tasksBox.innerHTML = '';

    tasks.forEach(task => {
        tasksBox.appendChild(task);
    })
}

// Edit choosen Task - functions
const editTask = event => {

}


// Settings - functions
const openSettingsModal = () => {
    settingsShadow.style.display = 'block';
    settingsModal.style.display = 'block';
}

const cleanSettingsModalInputs = () => {
    authorInput.value = '';
}

const closeSettingsModal = () => {
    settingsShadow.style.display = 'none';
    settingsModal.style.display = 'none';
    cleanSettingsModalInputs();
}

const saveSettings = () => {

    if (authorInput.value === '') {
        actualAuthor.textContent = actualAuthor.textContent;
    } else {
        actualAuthor.textContent = authorInput.value;
    }
    closeSettingsModal();
}

// New Task
newTaskBtn.addEventListener('click', openNewTaskModal);
closeTaskBtn.addEventListener('click', closeNewTaskModal);
saveTaskBtn.addEventListener('click', addNewTask);

// Edit Choosen Task

tasksBox.addEventListener('click', editTask);

// Settings
openSettingsBtn.addEventListener('click', openSettingsModal);
saveSettingsBtn.addEventListener('click', saveSettings);
closeSettingsBtn.addEventListener('click', closeSettingsModal);
