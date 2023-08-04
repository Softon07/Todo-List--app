const allTasks = [];
const importantTasks = [];
const completedTasks = [];
let numbersOfTasksToShow = 0;
let numberOFTasksOnPage = 6;
let taskID = 0;
let errors = 0;
let currentPage = 1;

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
const searchTask = document.querySelector('.header__search');
const headerName = document.querySelector('.header__name');
const headerOrderBtn = document.querySelector('.header__order-button');

const footerBoxes = document.querySelector('.footer__boxes');
const footerBox = document.createElement('button');
footerBox.classList.add('footer__box');

const openSettingsBtn = document.querySelector('.header__gear-icon');
const settingsShadow = document.querySelector('.modal-settings-shadow');
const settingsModal = document.querySelector('.modal-settings');
const authorInput = document.querySelector('.settings-author');
const saveSettingsBtn = document.querySelector('.modal-settings-save-btn');
const closeSettingsBtn = document.querySelector('.modal-settings-close-btn');
const actualAuthor = document.querySelector('.modal-settings__author');

// errors
const errorNameP = document.querySelector('.task-name-error');
const errorDescP = document.querySelector('.task-desc-error');

// category buttons
const myTasksCategoryBtn = document.querySelector('.my-tasks');
const importantTasksCategoryBtn = document.querySelector('.important');
const completedTasksCategoryBtn = document.querySelector('.completed');
const categoryBtns = [myTasksCategoryBtn, importantTasksCategoryBtn, completedTasksCategoryBtn];


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
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    const formattedDate = `${month} ${day}${getDaySuffix(day)} ${year} ${hours}:${minutes}:${seconds}${ampm}`;
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
    numbersOfTasksToShow++;
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

    // checks name error
    if (taskData.name.length === 0) {
        errorNameP.classList.add('show-error');
        return;
    }

    // checks description error
    if (taskData.description.length === 0) {
        errorDescP.classList.add('show-error');
        return;
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
        <div class="task__status-box">${getTaskStatus(taskData)}</div>
        <div class="task__info">
            <p class="task__date">${taskData.date}</p>
            <p class="task__name">${taskData.name}</p>
            <p class="task__description">${taskData.description}</p>
            <p class="task__author">${taskData.author}</p>
        </div>
        <div class='ifDone'></div>
    `;

    let statusOfTask = newTask.setAttribute('status', '');
    const iconStatus = newTask.querySelector('.task__status-box');

    setTaskStatus(statusOfTask, iconStatus, newTask);
    allTasks.push(newTask);

    showAllTasks();
    addFooterBox();

    closeNewTaskModal();
    cleanNewTaskModalInputs();

    newTask.addEventListener('click', handleEditTask);
    updateHeaderTitle('My tasks', allTasks.length);
}

const getTaskStatus = (checkbox) => {
    if (checkbox.completed === true) {
        return '<i class="fa-regular fa-square-check task__icon"></i>';
    } else if (checkbox.important === true) {
        return '<i class="fa-solid fa-exclamation task__icon"></i>';
    } else {
        return '<i class="fa-regular fa-square task__icon"></i>';
    }
};

const setTaskStatus = (statusOfTask, Icon, task) => {
    if (Icon.innerHTML === '<i class="fa-regular fa-square-check task__icon"></i>') {
        const doneDiv = task.querySelector('.ifDone');
        doneDiv.classList.add('done');
        statusOfTask = task.setAttribute('status', 'completedTask');
        completedTasks.push(task);
    } else if (Icon.innerHTML === '<i class="fa-solid fa-exclamation task__icon"></i>') {
        statusOfTask = task.setAttribute('status', 'importantTask');
        importantTasks.push(task);
    } else if (Icon.innerHTML === '<i class="fa-regular fa-square task__icon"></i>') {
        statusOfTask = task.setAttribute('status', 'normalTask');
    }
}

// Removes error message when writing something in name input.
taskName.addEventListener('input', () => {
    errorNameP.classList.remove('show-error');
});

// Removes error message when writing something in description input.
taskDescription.addEventListener('input', () => {
    errorDescP.classList.remove('show-error');
});

// adds highlight color on pressed category button.
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryBtns.forEach(otherBtn => {
            otherBtn.classList.remove('active');
        });
        btn.classList.add('active');
    });
});

const updateHeaderTitle = (categoryName, taskCount) => {
    let iconClass = "fa-solid fa-note-sticky"; // Domyślna ikona dla wszystkich tasków
    if (importantTasksCategoryBtn.classList.contains('active')) {
        categoryName = 'Important';
        iconClass = "fa-solid fa-circle-exclamation";
    } else if (completedTasksCategoryBtn.classList.contains('active')) {
        categoryName = 'Completed';
        iconClass = "fa-solid fa-check";
    }

    headerName.innerHTML = `<i class="category-icon ${iconClass}"></i> ${categoryName} (${taskCount})`;
};

const showAllTasks = () => {
    currentPage = 1;
    updateFooterBoxes();
    addFooterBox();
    updateHeaderTitle('My tasks', allTasks.length);
};

const showCompletedTasks = () => {
    currentPage = 1;
    updateFooterBoxes();
    addFooterBox();
    updateHeaderTitle('Completed', completedTasks.length);
};

const showImportantTasks = () => {
    currentPage = 1;
    updateFooterBoxes();
    addFooterBox();
    updateHeaderTitle('Important', importantTasks.length);
};

const handleEditTask = task => {
    const clickedTask = task.target.closest('.task');

    let taskName = clickedTask.getAttribute('name');
    let taskDesc = clickedTask.getAttribute('description');
    let taskImportant = clickedTask.getAttribute('important');
    let taskCompleted = clickedTask.getAttribute('completed');

    const modalEditTaskShadow = document.createElement('div');
    modalEditTaskShadow.classList.add('modal-edit-task-shadow');
    const modalEditTask = document.createElement('div');
    modalEditTask.classList.add('modal');
    modalEditTask.classList.add('modal-edit-task');
    modalEditTaskShadow.appendChild(modalEditTask);

    modalEditTask.innerHTML = `
        <p class="modal-edit-task__title modal-title">Edit Task - ${taskName}</p>

        <div class="modal-edit-task__box modal-box">
            <label for="name" class="modal-label">Task Name:</label>
            <input type="text" class="modal-input" id="task-name" value= ${taskName}>
            <p class="edit-task-name-error error">This field cannot be empty</p>
        </div>

        <div class="modal-edit-task__box modal-box">
            <label for="task-description" class="modal-label">Task Description:</label>
            <textarea name="task-description" id="task-description" class="modal-textarea">${taskDesc}</textarea>
            <p class="edit-task-name-error error">This field cannot be empty</p>
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

    saveBtn.addEventListener('click', () => {

        const editedTask = clickedTask.innerHTML;
        const doneDiv = clickedTask.querySelector('.ifDone');
        const editedTaskId = clickedTask.id;
        const taskName = clickedTask.getAttribute('name');
        const taskDesc = clickedTask.getAttribute('description');
        const taskImportant = clickedTask.getAttribute('important');
        const taskCompleted = clickedTask.getAttribute('completed');

        const newName = modalEditTask.querySelector('#task-name').value;
        const newDescription = modalEditTask.querySelector('#task-description').value;

        if (newName.trim() === '') {
            alert('Task name cannot be empty');
            return;
        }

        if (newDescription.trim() === '') {
            alert('Task description cannot be empty');
            return;
        }

        clickedTask.setAttribute('name', newName);
        clickedTask.setAttribute('description', newDescription);

        const taskStatus = clickedTask.querySelector('.task__status-box');
        const importantCheckbox = modalEditTask.querySelector('#important-checkbox');
        const completedCheckbox = modalEditTask.querySelector('#completed-checkbox');

        if (completedCheckbox.checked && !importantCheckbox.checked || (importantCheckbox.checked && completedCheckbox.checked)) {
            doneDiv.classList.add('done');
            taskStatus.innerHTML = '<i class="fa-regular fa-square-check task__icon"></i>';
            clickedTask.setAttribute('important', 'false');
            clickedTask.setAttribute('completed', 'true');
        } else if (importantCheckbox.checked && !completedCheckbox.checked) {
            taskStatus.innerHTML = '<i class="fa-solid fa-exclamation task__icon"></i>';
            doneDiv.classList.remove('done');
            clickedTask.setAttribute('important', 'true');
            clickedTask.setAttribute('completed', 'false');
        } else if (!importantCheckbox.checked && !completedCheckbox.checked) {
            taskStatus.innerHTML = '<i class="fa-regular fa-square task__icon"></i>';
            doneDiv.classList.remove('done');
            clickedTask.setAttribute('important', 'false');
            clickedTask.setAttribute('completed', 'false');
        }

        const taskNameElement = clickedTask.querySelector('.task__name');
        const taskDescriptionElement = clickedTask.querySelector('.task__description');
        taskNameElement.textContent = newName;
        taskDescriptionElement.textContent = newDescription;

        let statusOfTask = clickedTask.getAttribute('status');
        const iconStatus = clickedTask.querySelector('.task__status-box');
        setTaskStatus(statusOfTask, iconStatus, clickedTask);

        if (clickedTask.getAttribute('status') === 'normalTask') {
            const indexInImportant = importantTasks.indexOf(clickedTask);
            if (indexInImportant !== -1) {
                importantTasks.splice(indexInImportant, 1);
            }

            const indexInCompleted = completedTasks.indexOf(clickedTask);
            if (indexInCompleted !== -1) {
                completedTasks.splice(indexInCompleted, 1);
            }
        } else if (clickedTask.getAttribute('status') === 'completedTask') {
            const indexInImportant = importantTasks.indexOf(clickedTask);
            if (indexInImportant !== -1) {
                importantTasks.splice(indexInImportant, 1);
            }
        } else if (clickedTask.getAttribute('status') === 'importantTask') {
            const indexInCompleted = completedTasks.indexOf(clickedTask);
            if (indexInCompleted !== -1) {
                completedTasks.splice(indexInCompleted, 1);
            }
        }


        if (completedChecked.checked && !importantChecked.checked || (importantChecked.checked && completedChecked.checked)) {
            if (!completedTasks.includes(clickedTask)) {
                completedTasks.push(clickedTask);
            }
            if (importantTasks.includes(clickedTask)) {
                importantTasks.splice(importantTasks.indexOf(clickedTask), 1);
            }
        } else if (importantChecked.checked && !completedChecked.checked) {
            if (!importantTasks.includes(clickedTask)) {
                importantTasks.push(clickedTask);
            }
            if (completedTasks.includes(clickedTask)) {
                completedTasks.splice(completedTasks.indexOf(clickedTask), 1);
            }
        } else if (!importantChecked.checked && !completedChecked.checked) {
            if (importantTasks.includes(clickedTask)) {
                importantTasks.splice(importantTasks.indexOf(clickedTask), 1);
            }
            if (completedTasks.includes(clickedTask)) {
                completedTasks.splice(completedTasks.indexOf(clickedTask), 1);
            }
        }

        if (myTasksCategoryBtn.classList.contains('active')) {
            showAllTasks();
        } else if (importantTasksCategoryBtn.classList.contains('active')) {
            showImportantTasks();
        } else if (completedTasksCategoryBtn.classList.contains('active')) {
            showCompletedTasks();
        }

        modalEditTaskShadow.style.display = 'none';
        modalEditTask.style.display = 'none';
        document.body.removeChild(modalEditTaskShadow);
    });

    closeBtn.addEventListener('click', () => {
        modalEditTaskShadow.style.display = 'none';
        modalEditTask.style.display = 'none';
        document.body.removeChild(modalEditTaskShadow);
    })

    removeBtn.addEventListener('click', () => {
        numbersOfTasksToShow--;
        modalEditTaskShadow.style.display = 'none';
        modalEditTask.style.display = 'none';

        const parentElement = clickedTask.parentElement;
        parentElement.removeChild(clickedTask);

        const taskId = clickedTask.id;

        const taskIndex = allTasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            allTasks.splice(taskIndex, 1);
        }

        const importantIndex = importantTasks.findIndex(task => task.id === taskId);
        if (importantIndex !== -1) {
            importantTasks.splice(importantIndex, 1);
        }

        const completedIndex = completedTasks.findIndex(task => task.id === taskId);
        if (completedIndex !== -1) {
            completedTasks.splice(completedIndex, 1);
        }

        document.body.removeChild(modalEditTaskShadow);
        updateHeaderTitle('My tasks', allTasks.length);
    });


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

const searchForTask = () => {
    const searchText = searchTask.value.toLowerCase();

    allTasks.forEach(task => {
        const taskName = task.getAttribute('name').toLowerCase();
        const taskDescription = task.getAttribute('description').toLowerCase();

        const isMatch = taskName.includes(searchText) || taskDescription.includes(searchText);

        if (isMatch) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    });
}

myTasksCategoryBtn.addEventListener('click', () => {
    showAllTasks();
});

importantTasksCategoryBtn.addEventListener('click', () => {
    showImportantTasks();
});

completedTasksCategoryBtn.addEventListener('click', () => {
    showCompletedTasks();
});

const addFooterBox = () => {
    let tasksToShow;
    if (myTasksCategoryBtn.classList.contains('active')) {
        tasksToShow = allTasks;
    } else if (importantTasksCategoryBtn.classList.contains('active')) {
        tasksToShow = importantTasks;
    } else if (completedTasksCategoryBtn.classList.contains('active')) {
        tasksToShow = completedTasks;
    }

    const totalTasks = tasksToShow.length;
    const totalPages = Math.ceil(totalTasks / numberOFTasksOnPage);

    footerBoxes.innerHTML = '';
    if (totalPages > 0) {
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.classList.add('footer__box');
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                updatePageButtons(totalPages);
                updateFooterBoxes();
            });
            footerBoxes.appendChild(pageBtn);
        }
    } else {
        currentPage = 1;
    }

    updatePageButtons(totalPages);
};

const updateFooterBoxes = () => {
    tasksBox.innerHTML = '';
    let tasksToShow;

    if (myTasksCategoryBtn.classList.contains('active')) {
        tasksToShow = allTasks;
    } else if (importantTasksCategoryBtn.classList.contains('active')) {
        tasksToShow = importantTasks;
    } else if (completedTasksCategoryBtn.classList.contains('active')) {
        tasksToShow = completedTasks;
    }

    const startIndex = (currentPage - 1) * numberOFTasksOnPage;
    const endIndex = startIndex + numberOFTasksOnPage;

    tasksToShow.slice(startIndex, endIndex).forEach(task => {
        tasksBox.appendChild(task);
    });
};

const updatePageButtons = totalPages => {
    const pageButtons = footerBoxes.querySelectorAll('.footer__box');
    pageButtons.forEach((button, index) => {
        if (index + 1 <= totalPages) {
            button.style.display = 'flex';
        } else {
            button.style.display = 'none';
        }
    });
};

const lightBtn = document.querySelector('.light-btn');
const darkBtn = document.querySelector('.dark-btn');

const setLightTheme = () => {
    document.documentElement.style.setProperty('--main-color', 'rgb(0, 102, 255)');
    document.documentElement.style.setProperty('--gold', 'rgba(0, 0, 0, 0.582');
    document.documentElement.style.setProperty('--purple', 'rgb(152, 76, 195)');
    document.documentElement.style.setProperty('--gray', 'rgb(240, 240, 240)');
    document.documentElement.style.setProperty('--dark', 'rgb(255, 255, 255)');
    document.documentElement.style.setProperty('--light', 'rgb(51, 51, 51)');
    document.documentElement.style.setProperty('--blue', 'rgb(0, 102, 255)');
    document.documentElement.style.setProperty('--red', 'rgb(218, 34, 34)');
    document.documentElement.style.setProperty('--green', 'rgb(43, 247, 43)');
    document.documentElement.style.setProperty('--dark-shadow', 'rgba(255, 255, 255, 0.85)');

}

const setDarkTheme = () => {
    document.documentElement.style.setProperty('--main-color', 'rgb(255, 192, 123)');
    document.documentElement.style.setProperty('--gold', 'rgba(255, 229, 81, 0.582)');
    document.documentElement.style.setProperty('--purple', 'rgb(152, 76, 195)');
    document.documentElement.style.setProperty('--gray', 'rgb(26, 28, 30)');
    document.documentElement.style.setProperty('--dark', 'rgb(8, 9, 11)');
    document.documentElement.style.setProperty('--light', 'rgb(228, 225, 221)');
    document.documentElement.style.setProperty('--blue', 'rgb(122, 122, 255)');
    document.documentElement.style.setProperty('--red', 'rgb(218, 34, 34)');
    document.documentElement.style.setProperty('--green', 'rgb(43, 247, 43)');
    document.documentElement.style.setProperty('--dark-shadow', 'rgba(0, 0, 0, 0.8)');
}

showAllTasks();

newTaskBtn.addEventListener('click', openNewTaskModal);
closeTaskBtn.addEventListener('click', closeNewTaskModal);
saveTaskBtn.addEventListener('click', addNewTask);

openSettingsBtn.addEventListener('click', openSettingsModal);
saveSettingsBtn.addEventListener('click', saveSettings);
closeSettingsBtn.addEventListener('click', closeSettingsModal);

searchTask.addEventListener('input', searchForTask);
lightBtn.addEventListener('click', setLightTheme);
darkBtn.addEventListener('click', setDarkTheme);
