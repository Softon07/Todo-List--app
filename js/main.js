const tasks = [];
let taskID = 0;
let errors = 0;

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

const openSettingsBtn = document.querySelector('.header__gear-icon');
const settingsShadow = document.querySelector('.modal-settings-shadow');
const settingsModal = document.querySelector('.modal-settings');
const authorInput = document.querySelector('.settings-author');
const saveSettingsBtn = document.querySelector('.modal-settings-save-btn');
const closeSettingsBtn = document.querySelector('.modal-settings-close-btn');
const actualAuthor = document.querySelector('.modal-settings__author');

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

const addNewTask = () => {
    const nameValue = taskName.value;
    const descriptionValue = taskDescription.value;
    const errorParagrapg1 = document.querySelector('.task-name-error');
    const errorParagrapg2 = document.querySelector('.task-desc-error');

    if (nameValue.length === 0) {
        errorParagrapg1.classList.add('show-error');
        return;
    }

    if (descriptionValue.length === 0) {
        errorParagrapg2.classList.add('show-error');
        return;
    }

    taskID++;
    const currentDate = new Date();
    const taskDate = getFormattedDate(currentDate);

    const taskData = {
        id: taskID,
        name: taskName.value,
        description: taskDescription.value,
        important: importantCheckbox.checked,
        completed: completedCheckbox.checked,
        date: taskDate,
        author: actualAuthor.textContent
    }

    const newTask = document.createElement('div');
    newTask.classList.add('task');
    newTask.setAttribute('id', taskData.id);
    newTask.setAttribute('name', taskData.name);
    newTask.setAttribute('description', taskData.description);
    newTask.setAttribute('important', taskData.important);
    newTask.setAttribute('completed', taskData.completed);
    newTask.setAttribute('date', taskData.date);
    newTask.setAttribute('author', taskData.author);

    newTask.innerHTML = `
    <div class="task__status-box"><i class="fa-regular fa-square task__icon"></i></div>
    <div class="task__info">
        <p class="task__date">${taskData.date}</p>
        <p class="task__name">${taskData.name}</p>
        <p class="task__description">${taskData.description}</p>
        <p class="task__author">${taskData.author}</p>
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

    newTask.addEventListener('click', handleEditTask);
}

taskName.addEventListener('input', () => {
    const errorParagrapg1 = document.querySelector('.task-name-error');
    errorParagrapg1.classList.remove('show-error');
});

taskDescription.addEventListener('input', () => {
    const errorParagrapg2 = document.querySelector('.task-desc-error');
    errorParagrapg2.classList.remove('show-error');
});

const updateTasksView = () => {
    tasksBox.innerHTML = '';

    tasks.forEach(task => {
        tasksBox.appendChild(task);
    })
}

const handleEditTask = task => {
    const clickedTask = task.target.closest('.task');

    let taskId = clickedTask.id;
    let taskName = clickedTask.getAttribute('name');
    let taskDesc = clickedTask.getAttribute('description');
    let taskImportant = clickedTask.getAttribute('important');
    let taskCompleted = clickedTask.getAttribute('completed');
    let taskDate = clickedTask.getAttribute('date');
    let taskAuthor = clickedTask.getAttribute('date');

    const modalEditTaskShadow = document.createElement('div');
    modalEditTaskShadow.classList.add('modal-edit-task-shadow');
    const modalEditTask = document.createElement('div');
    modalEditTask.classList.add('modal');
    modalEditTask.classList.add('modal-edit-task');
    modalEditTaskShadow.appendChild(modalEditTask);

    modalEditTask.innerHTML = `
        <p class="modal-edit-task__title modal-title">Edit Task -> ${taskName}</p>

        <div class="modal-edit-task__box modal-box">
            <label for="name" class="modal-label">Task Name:</label>
            <input type="text" class="modal-input" id="task-name" value= ${taskName}>
        </div>

        <div class="modal-edit-task__box modal-box">
            <label for="task-description" class="modal-label">Task Description:</label>
            <textarea name="task-description" id="task-description" class="modal-textarea">${taskDesc}</textarea>
        </div>

        <div class="modal-edit-task__box modal-box">
            <label for="name" class="modal-label">Important:</label>
            <input type="checkbox" class="modal-input modal-checkbox" id="important-checkbox">
        </div>

        <div class="modal-edit-task__box modal-box">
            <label for="name" class="modal-label">Completed:</label>
            <input type="checkbox" class="modal-input modal-checkbox" id="completed-checkbox">
        </div>

        <div class="modal-edit-task__box modal-edit-task__box-buttons">
            <button class="edit-task-save-btn modal-edit-task__edit-task-btn">Save</button>
            <button class="edit-task-close-btn modal-edit-task__edit-task-btn">Close</button>
            <button class="edit-task-remove-btn modal-edit-task__edit-task-btn">Remove</button>
        </div>
    `;

    const importantChecked = modalEditTask.querySelector('#important-checkbox');
    if (taskImportant == 'true') importantChecked.checked = true;

    const completedChecked = modalEditTask.querySelector('#completed-checkbox');
    if (taskCompleted == 'true') completedChecked.checked = true;

    document.body.appendChild(modalEditTaskShadow);
    modalEditTaskShadow.style.display = 'block';
    modalEditTask.style.display = 'block';


    const saveBtn = modalEditTask.querySelector('.edit-task-save-btn');
    const closeBtn = modalEditTask.querySelector('.edit-task-close-btn');
    const removeBtn = modalEditTask.querySelector('.edit-task-remove-btn');

    closeBtn.addEventListener('click', () => {
        modalEditTaskShadow.style.display = 'none';
        modalEditTask.style.display = 'none';
        document.body.removeChild(modalEditTaskShadow);
    })

    removeBtn.addEventListener('click', () => {
        modalEditTaskShadow.style.display = 'none';
        modalEditTask.style.display = 'none';

        const parentElement = clickedTask.parentElement;
        parentElement.removeChild(clickedTask);

        const taskId = clickedTask.id;

        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
        }

        document.body.removeChild(modalEditTaskShadow);
    })

}

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

newTaskBtn.addEventListener('click', openNewTaskModal);
closeTaskBtn.addEventListener('click', closeNewTaskModal);
saveTaskBtn.addEventListener('click', addNewTask);

openSettingsBtn.addEventListener('click', openSettingsModal);
saveSettingsBtn.addEventListener('click', saveSettings);
closeSettingsBtn.addEventListener('click', closeSettingsModal);
