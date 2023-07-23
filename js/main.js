// New task - variables
const newTaskBtn = document.querySelector('.category__new-task');
const newTaskShadow = document.querySelector('.modal-new-task-shadow');
const newTaskModal = document.querySelector('.modal-new-task');
const saveTaskBtn = document.querySelector('.new-task-save-btn');
const closeTaskBtn = document.querySelector('.new-task-close-btn');

const taskName = document.querySelector('#task-name');
const taskDescription = document.querySelector('#task-description');
const importantCheckbox = document.querySelector('#important-checkbox');
const completedCheckbox = document.querySelector('#completed-checkbox');

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

const addTask = () => {
    closeNewTaskModal();
    cleanNewTaskModalInputs();
}

// Settings - variables
const openSettingsBtn = document.querySelector('.header__gear-icon');
const settingsShadow = document.querySelector('.modal-settings-shadow');
const settingsModal = document.querySelector('.modal-settings');
const authorInput = document.querySelector('.settings-author');
const saveSettingsBtn = document.querySelector('.modal-settings-save-btn');
const closeSettingsBtn = document.querySelector('.modal-settings-close-btn');
const actualAuthor = document.querySelector('.modal-settings__author');

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
saveTaskBtn.addEventListener('click', addTask);

// Settings

openSettingsBtn.addEventListener('click', openSettingsModal);
saveSettingsBtn.addEventListener('click', saveSettings);
closeSettingsBtn.addEventListener('click', closeSettingsModal);