/* =====================================
   TaskFlow - Todo App
===================================== */


/* =========================
   DOM
========================= */

const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const taskModal = document.getElementById("taskModal");

const taskForm = document.getElementById("taskForm");

const taskId = document.getElementById("taskId");
const taskName = document.getElementById("taskName");
const taskDescription = document.getElementById("taskDescription");
const taskDate = document.getElementById("taskDate");
const taskPriority = document.getElementById("taskPriority");
const taskCategory = document.getElementById("taskCategory");

const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

const modalTitle = document.getElementById("modalTitle");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");
const toastIcon = document.getElementById("toastIcon");


/* =========================
   State
========================= */

let tasks = JSON.parse(
    localStorage.getItem("taskflow_tasks")
) || [];

let currentFilter = "all";
let currentCategory = null;


/* =========================
   Initialization
========================= */

document.addEventListener("DOMContentLoaded", () => {

    showCurrentDate();

    renderTasks();

    updateStatistics();

    setupEvents();

    loadTheme();

});


/* =========================
   Events
========================= */

function setupEvents() {

    /* 新增 */

    document
        .getElementById("addTaskBtn")
        .addEventListener("click", () => {

            openModal();

        });


    document
        .getElementById("emptyAddBtn")
        .addEventListener("click", () => {

            openModal();

        });


    /* 關閉 */

    document
        .getElementById("closeModal")
        .addEventListener("click", closeModal);


    document
        .getElementById("cancelBtn")
        .addEventListener("click", closeModal);


    document
        .querySelector(".modal-overlay")
        .addEventListener("click", closeModal);


    /* Form */

    taskForm.addEventListener(
        "submit",
        handleFormSubmit
    );


    /* 搜尋 */

    searchInput.addEventListener(
        "input",
        renderTasks
    );


    /* 排序 */

    sortSelect.addEventListener(
        "change",
        renderTasks
    );


    /* Filter */

    document
        .querySelectorAll(".nav-item")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    currentFilter =
                        button.dataset.filter;

                    currentCategory = null;

                    document
                        .querySelectorAll(".nav-item")
                        .forEach(item =>
                            item.classList.remove("active")
                        );

                    button.classList.add("active");

                    updateTaskTitle();

                    renderTasks();

                }
            );

        });


    /* Category */

    document
        .querySelectorAll(".category-item")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    currentCategory =
                        button.dataset.category;

                    currentFilter = "all";

                    document
                        .querySelectorAll(".nav-item")
                        .forEach(item =>
                            item.classList.remove("active")
                        );

                    updateTaskTitle();

                    renderTasks();

                }
            );

        });


    /* 今天 */

    document
        .getElementById("todayBtn")
        .addEventListener("click", () => {

            const today =
                formatDate(new Date());

            const filtered =
                tasks.filter(task =>
                    task.date === today
                );

            renderTasks(filtered, true);

            document.getElementById("taskTitle")
                .textContent = "今天的任務";

            document.getElementById("taskSubtitle")
                .textContent =
                `${filtered.length} 個任務`;

        });


    /* Theme */

    document
        .getElementById("themeToggle")
        .addEventListener(
            "click",
            toggleTheme
        );


    /* Clear */

    document
        .getElementById("clearCompleted")
        .addEventListener(
            "click",
            clearCompleted
        );


    /* Escape */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                taskModal.classList.contains("show")
            ) {

                closeModal();

            }

        }
    );

}


/* =========================
   Modal
========================= */

function openModal(task = null) {

    taskModal.classList.add("show");

    document.body.style.overflow = "hidden";

    if (task) {

        modalTitle.textContent = "編輯任務";

        taskId.value = task.id;

        taskName.value = task.name;

        taskDescription.value =
            task.description || "";

        taskDate.value =
            task.date || "";

        taskPriority.value =
            task.priority || "medium";

        taskCategory.value =
            task.category || "其他";

    } else {

        modalTitle.textContent = "新增任務";

        taskForm.reset();

        taskId.value = "";

        taskPriority.value = "medium";

        taskCategory.value = "工作";

        taskDate.value =
            formatDate(new Date());

    }


    setTimeout(() => {

        taskName.focus();

    }, 100);

}


function closeModal() {

    taskModal.classList.remove("show");

    document.body.style.overflow = "";

    taskForm.reset();

    taskId.value = "";

}


/* =========================
   Form
========================= */

function handleFormSubmit(event) {

    event.preventDefault();


    const name =
        taskName.value.trim();


    if (!name) {

        showToast(
            "請輸入任務名稱",
            "!"
        );

        return;

    }


    const id =
        taskId.value;


    if (id) {

        const task =
            tasks.find(
                item => item.id === id
            );


        if (task) {

            task.name = name;

            task.description =
                taskDescription.value.trim();

            task.date =
                taskDate.value;

            task.priority =
                taskPriority.value;

            task.category =
                taskCategory.value;

            showToast(
                "任務已更新",
                "✓"
            );

        }

    } else {

        const newTask = {

            id:
                Date.now().toString(),

            name,

            description:
                taskDescription.value.trim(),

            date:
                taskDate.value,

            priority:
                taskPriority.value,

            category:
                taskCategory.value,

            completed: false,

            createdAt:
                Date.now()

        };


        tasks.unshift(newTask);


        showToast(
            "任務已新增",
            "✓"
        );

    }


    saveTasks();

    closeModal();

    renderTasks();

    updateStatistics();

}


/* =========================
   Render
========================= */

function renderTasks(customTasks = null, skipFilter = false) {

    let filteredTasks =
        customTasks || [...tasks];


    if (!skipFilter) {

        /* Filter */

        if (currentFilter === "active") {

            filteredTasks =
                filteredTasks.filter(
                    task => !task.completed
                );

        }


        if (currentFilter === "completed") {

            filteredTasks =
                filteredTasks.filter(
                    task => task.completed
                );

        }


        /* Category */

        if (currentCategory) {

            filteredTasks =
                filteredTasks.filter(
                    task =>
                        task.category === currentCategory
                );

        }


        /* Search */

        const search =
            searchInput.value
                .trim()
                .toLowerCase();


        if (search) {

            filteredTasks =
                filteredTasks.filter(task =>

                    task.name
                        .toLowerCase()
                        .includes(search)

                    ||

                    (task.description || "")
                        .toLowerCase()
                        .includes(search)

                );

        }

    }


    /* Sort */

    const sort =
        sortSelect.value;


    if (sort === "created") {

        filteredTasks.sort(
            (a, b) =>
                b.createdAt - a.createdAt
        );

    }


    if (sort === "priority") {

        const priorityValue = {

            high: 3,

            medium: 2,

            low: 1

        };


        filteredTasks.sort(
            (a, b) =>
                priorityValue[b.priority] -
                priorityValue[a.priority]
        );

    }


    if (sort === "date") {

        filteredTasks.sort((a, b) => {

            if (!a.date) return 1;

            if (!b.date) return -1;

            return a.date.localeCompare(b.date);

        });

    }


    taskList.innerHTML = "";


    if (filteredTasks.length === 0) {

        emptyState.style.display = "block";

        return;

    }


    emptyState.style.display = "none";


    filteredTasks.forEach(task => {

        taskList.appendChild(
            createTaskElement(task)
        );

    });

}


/* =========================
   Create Task
========================= */

function createTaskElement(task) {

    const element =
        document.createElement("div");


    element.className =
        `task ${task.completed ? "completed" : ""}`;


    const priorityText = {

        high: "高優先",

        medium: "中優先",

        low: "低優先"

    };


    let dateHTML = "";


    if (task.date) {

        const status =
            getDateStatus(task.date);


        dateHTML = `
            <span class="due-date ${status.className}">
                📅 ${status.text}
            </span>
        `;

    }


    element.innerHTML = `

        <button
            class="task-check"
            aria-label="完成任務"
        ></button>


        <div class="task-content">

            <div class="task-name">
                ${escapeHTML(task.name)}
            </div>

            ${
                task.description
                ?
                `
                <div class="task-description">
                    ${escapeHTML(task.description)}
                </div>
                `
                :
                ""
            }


            <div class="task-meta">

                <span class="tag category-tag">
                    ${escapeHTML(task.category)}
                </span>

                <span class="tag priority-${task.priority}">
                    ${priorityText[task.priority]}
                </span>

                ${dateHTML}

            </div>

        </div>


        <div class="task-actions">

            <button
                class="task-action edit"
                title="編輯"
            >
                ✏️
            </button>

            <button
                class="task-action delete"
                title="刪除"
            >
                🗑️
            </button>

        </div>

    `;


    /* Complete */

    element
        .querySelector(".task-check")
        .addEventListener(
            "click",
            () => toggleTask(task.id)
        );


    /* Edit */

    element
        .querySelector(".edit")
        .addEventListener(
            "click",
            () => {

                openModal(task);

            }
        );


    /* Delete */

    element
        .querySelector(".delete")
        .addEventListener(
            "click",
            () => deleteTask(task.id)
        );


    return element;

}


/* =========================
   Toggle
========================= */

function toggleTask(id) {

    const task =
        tasks.find(
            item => item.id === id
        );


    if (!task) return;


    task.completed =
        !task.completed;


    saveTasks();

    renderTasks();

    updateStatistics();


    showToast(
        task.completed
            ? "任務已完成 🎉"
            : "任務恢復進行中",
        task.completed ? "✓" : "↩"
    );

}


/* =========================
   Delete
========================= */

function deleteTask(id) {

    const task =
        tasks.find(
            item => item.id === id
        );


    if (!task) return;


    if (
        !confirm(
            `確定要刪除「${task.name}」嗎？`
        )
    ) {

        return;

    }


    tasks =
        tasks.filter(
            item => item.id !== id
        );


    saveTasks();

    renderTasks();

    updateStatistics();


    showToast(
        "任務已刪除",
        "✓"
    );

}


/* =========================
   Statistics
========================= */

function updateStatistics() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const active =
        total - completed;


    const progress =
        total === 0
            ? 0
            : Math.round(
                completed / total * 100
            );


    document.getElementById("allCount")
        .textContent = total;


    document.getElementById("activeCount")
        .textContent = active;


    document.getElementById("completedCount")
        .textContent = completed;


    document.getElementById("statAll")
        .textContent = total;


    document.getElementById("statActive")
        .textContent = active;


    document.getElementById("statCompleted")
        .textContent = completed;


    document.getElementById("progressText")
        .textContent = `${progress}%`;


    document.getElementById("progressBar")
        .style.width = `${progress}%`;

}


/* =========================
   Filter title
========================= */

function updateTaskTitle() {

    const title =
        document.getElementById("taskTitle");

    const subtitle =
        document.getElementById("taskSubtitle");


    if (currentCategory) {

        title.textContent =
            currentCategory;

        const count =
            tasks.filter(
                task =>
                    task.category === currentCategory
            ).length;

        subtitle.textContent =
            `${count} 個任務`;

        return;

    }


    const titles = {

        all: "全部任務",

        active: "進行中",

        completed: "已完成"

    };


    title.textContent =
        titles[currentFilter];


    const filtered =
        currentFilter === "all"

            ? tasks

            : currentFilter === "active"

                ? tasks.filter(
                    task => !task.completed
                )

                : tasks.filter(
                    task => task.completed
                );


    subtitle.textContent =
        `${filtered.length} 個任務`;

}


/* =========================
   Clear completed
========================= */

function clearCompleted() {

    const completed =
        tasks.filter(
            task => task.completed
        );


    if (completed.length === 0) {

        showToast(
            "目前沒有已完成任務",
            "!"
        );

        return;

    }


    if (
        !confirm(
            `確定要刪除 ${completed.length} 個已完成任務嗎？`
        )
    ) {

        return;

    }


    tasks =
        tasks.filter(
            task => !task.completed
        );


    saveTasks();

    renderTasks();

    updateStatistics();


    showToast(
        "已清除完成任務",
        "✓"
    );

}


/* =========================
   Date
========================= */

function showCurrentDate() {

    const now =
        new Date();


    const date =
        now.toLocaleDateString(
            "zh-TW",
            {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long"
            }
        );


    document.getElementById(
        "currentDate"
    ).textContent = date;

}


function formatDate(date) {

    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


function getDateStatus(dateString) {

    const today =
        new Date();


    today.setHours(
        0, 0, 0, 0
    );


    const target =
        new Date(
            dateString + "T00:00:00"
        );


    const diff =
        Math.round(
            (target - today)
            / 86400000
        );


    if (diff < 0) {

        return {
            text: `逾期 ${Math.abs(diff)} 天`,
            className: "overdue"
        };

    }


    if (diff === 0) {

        return {
            text: "今天",
            className: "today"
        };

    }


    if (diff === 1) {

        return {
            text: "明天",
            className: ""
        };

    }


    return {
        text:
            target.toLocaleDateString(
                "zh-TW",
                {
                    month: "numeric",
                    day: "numeric"
                }
            ),

        className: ""
    };

}


/* =========================
   Storage
========================= */

function saveTasks() {

    localStorage.setItem(
        "taskflow_tasks",
        JSON.stringify(tasks)
    );

}


/* =========================
   Theme
========================= */

function toggleTheme() {

    document.body.classList.toggle("dark");


    const dark =
        document.body.classList.contains("dark");


    localStorage.setItem(
        "taskflow_theme",
        dark ? "dark" : "light"
    );


    updateThemeButton();

}


function loadTheme() {

    const theme =
        localStorage.getItem(
            "taskflow_theme"
        );


    if (theme === "dark") {

        document.body.classList.add("dark");

    }


    updateThemeButton();

}


function updateThemeButton() {

    const button =
        document.getElementById(
            "themeToggle"
        );


    const dark =
        document.body.classList.contains("dark");


    button.innerHTML =
        dark
            ? "☀️ <span>淺色模式</span>"
            : "🌙 <span>深色模式</span>";

}


/* =========================
   Toast
========================= */

let toastTimer;


function showToast(message, icon = "✓") {

    toastMessage.textContent =
        message;

    toastIcon.textContent =
        icon;


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2500);

}


/* =========================
   Security
========================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent =
        text;


    return div.innerHTML;

}
