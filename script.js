let todolist = [];
let goals = [];
let theme = localStorage.getItem("theme") || "light";
let bgURL = localStorage.getItem("bgURL") || "./assets/images/morning.jpg";

const popup = document.querySelector("#popup");
const popupContent = document.querySelector("#popup-content");
const popupClose = document.querySelector(".popup .popup-nav .dots .close");
const popupPageTitle = document.querySelector(".popup .popup-nav .page-title");

const themeIcon = document.querySelector(".theme-ic");
const background = document.querySelector(".background");

function applyTheme(nextTheme) {
    theme = nextTheme;

    document.body.classList.toggle("dark", theme === "dark");
    themeIcon.classList.remove("ri-sun-fill", "ri-moon-fill");
    themeIcon.classList.add(theme === "dark" ? "ri-moon-fill" : "ri-sun-fill");

    localStorage.setItem("theme", theme);
}

function applyWallpaper(newBgURL) {
    bgURL = newBgURL;

    background.style.background = `url(${bgURL})`;
    background.style.backgroundSize = "cover";
    background.style.backgroundPosition = "center";

    localStorage.setItem("bgURL", bgURL);
}

function toggleTheme() {

    applyTheme(theme === "dark" ? "light" : "dark");
}

applyTheme(theme);

function autoTheme() {
    const hour = new Date().getHours();
    let imgURL = "./assets/images/morning.jpg";
    if (hour >= 6 && hour < 17) {
        // Day (6 AM - 4:59 PM)
        imgURL = "./assets/images/morning.jpg";
    } else if (hour >= 17 && hour < 20) {
        // Evening (5 PM - 7:59 PM)
        imgURL = "./assets/images/evening.png";
    } else {
        // Night (8 PM - 5:59 AM)
        imgURL = "./assets/images/night.png";
    }
    applyWallpaper(imgURL);
}

//autoTheme();

document.querySelectorAll(".feature").forEach((f) => {
    f.addEventListener("click", () => {
        popup.classList.add("show");
        if (f.dataset.feature === "todo-list") {
            popupPageTitle.textContent = "Todo List";
            popupContent.innerHTML = todoListUI();
            todoList();
        }
        if (f.dataset.feature === "daily-planner") {
            popupPageTitle.textContent = "Daily Planner";
            popupContent.innerHTML = dailyPlannerUI();
            dailyPlanner();
        }
        if (f.dataset.feature === "motivational-quotes") {
            popupPageTitle.textContent = "Motivational Quotes";
            popupContent.innerHTML = motivationalQuotesUI();
            motivationalQuotes();
        }
        if (f.dataset.feature === "pomodoro-timer") {
            popupPageTitle.textContent = "Pomodoro Timer";
            popupContent.innerHTML = pomodoroUI();
            pomodoroTimer();
        }
        if (f.dataset.feature === "goals") {
            popupPageTitle.textContent = "Goals";
            popupContent.innerHTML = goalsUI();
            goalsList();
        }
    });
});

popupClose.addEventListener("click", () => {
    popup.classList.remove("show");
});


themeIcon.addEventListener("click", () => {
    toggleTheme();
});

/**
 * Todo List UI and Logic
 */
function todoListUI() {
    return `<section class="detail-container">
                <section class="todo-list-container">
                    <section class="todo-list-form glass">
                        <h2 class="add-task-title">ADD TASK</h2>
                        <form action="#">
                            <input class="glass" type="text" placeholder="Task Title" name="todo-title" id="todo-title" autofocus required>
                            <textarea class="glass" placeholder="Task Description" name="todo-desc" id="todo-desc" rows="5" required></textarea>
                            <label>
                                <input class="glass" type="checkbox" name="todo-isimp" id="todo-isimp">
                                Mark as Important
                            </label>
                            <button class="glass" type="submit">Add Task</button>
                        </form>
                    </section>
                    <section class="todo-list-items glass"></section>
                </section>
            </section>`;
}

function todoList() {
    const form = document.querySelector(".todo-list-form form");
    const titleInput = document.querySelector("#todo-title");
    const descInput = document.querySelector("#todo-desc");
    const isImportantInput = document.querySelector("#todo-isimp");
    const submitButton = document.querySelector(".todo-list-form form button");
    const taskTitleHeading = document.querySelector(".add-task-title");
    const todoListItems = document.querySelector(".todo-list-items");

    let editingTaskId = null;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = titleInput.value.trim();
        const desc = descInput.value.trim();

        if (!title || !desc) return;

        if (editingTaskId) {
            updateTask(editingTaskId, title, desc, isImportantInput.checked);
        } else {
            addTask(title, desc, isImportantInput.checked);
        }
    });

    function addTask(title, desc, isImportant) {
        todolist.push({
            tid: "tid-" + Date.now(),
            title,
            description: desc,
            isCompleted: false,
            isImportant
        });

        resetTaskForm();
        setTaskListFromLocalStorage(todolist);
        showTaskList();
    }

    function updateTask(taskId, title, desc, isImportant) {
        const task = todolist.find((item) => item.tid === taskId);

        if (task) {
            task.title = title;
            task.description = desc;
            task.isImportant = isImportant;
            setTaskListFromLocalStorage(todolist);
            showTaskList();
        }

        resetTaskForm();
    }

    function resetTaskForm() {
        titleInput.value = "";
        descInput.value = "";
        isImportantInput.checked = false;
        editingTaskId = null;
        submitButton.textContent = "Add Task";
        taskTitleHeading.textContent = "ADD TASK";
        titleInput.focus();
    }

    function startEditingTask(taskId) {
        const task = todolist.find((item) => item.tid === taskId);

        if (!task) return;

        titleInput.value = task.title;
        descInput.value = task.description;
        isImportantInput.checked = task.isImportant;
        editingTaskId = task.tid;
        submitButton.textContent = "Update Task";
        taskTitleHeading.textContent = "EDIT TASK";
        titleInput.focus();
    }

    function deleteTask(taskId) {
        todolist = todolist.filter((item) => item.tid !== taskId);
        setTaskListFromLocalStorage(todolist);
        showTaskList();
    }

    function showTaskList() {
        getTaskListFromLocalStorage();
        let sum = "";
        todolist.forEach((todo) => {
            sum += `<div class="task glass" data-task-id="${todo.tid}">
                    <div class="task-info">
                        <h2 class="task-title">${todo.title}</h2>
                        <p class="task-desc">${todo.description}</p>
                        ${todo.isImportant ? `<span class="task-imp glass">Imp</span>` : ""}
                    </div>
                    <div class="task-actions">
                        ${todo.isCompleted ? `<button class="completed-bt glass">Completed</button>` : `<button class="mark-complete-bt glass">Mark Complete</button>`}
                        <button class="edit-task-bt glass">Edit</button>
                        <button class="delete-task-bt glass">Delete</button>
                    </div>
               </div>`;
        });
        todoListItems.innerHTML = sum || "<h3>No task added yet</h3>";
    }

    todoListItems.addEventListener("click", (e) => {
        const actionButton = e.target.closest("button");
        if (!actionButton) return;

        const taskCard = actionButton.closest(".task");
        const taskId = taskCard?.dataset.taskId;

        if (!taskId) return;

        if (actionButton.classList.contains("mark-complete-bt")) {
            markCompleted(taskId);
        } else if (actionButton.classList.contains("edit-task-bt")) {
            startEditingTask(taskId);
        } else if (actionButton.classList.contains("delete-task-bt")) {
            deleteTask(taskId);
        }
    });

    function markCompleted(taskId) {
        const task = todolist.find((item) => item.tid === taskId);
        if (task) {
            task.isCompleted = true;
            setTaskListFromLocalStorage(todolist);
            showTaskList();
        }
    }

    function getTaskListFromLocalStorage() {
        if (localStorage.getItem("tasklist")) {
            todolist = JSON.parse(localStorage.getItem("tasklist")).map((task, index) => ({
                ...task,
                tid: task.tid || `tid-${Date.now()}-${index}`
            }));
            todoListItems.style.justifyContent = "flex-start";
        } else {
            todolist = [];
            todoListItems.style.justifyContent = "center";
        }
    }

    function setTaskListFromLocalStorage(tasklist) {
        localStorage.setItem("tasklist", JSON.stringify(tasklist));
    }

    showTaskList();
}

/**
 * Daily Planner UI and Logic
 */
function dailyPlannerUI() {
    return `<section class="detail-container">
                <section class="daily-planner-container glass"></section>
            </section>`;
}

function dailyPlanner() {
    const start = 6;
    const end = 24;
    let dailyPlanner = [];

    for (let i = start; i < end; i++) {
        dailyPlanner.push({
            time: `${i}:00 - ${i + 1}:00`,
            plan: ""
        });
    }

    const dailyPlannerContainer = document.querySelector(".daily-planner-container");

    function getDailyPlannerFromLocalStorage() {
        if (localStorage.getItem("dailyplanner")) {
            dailyPlanner = JSON.parse(localStorage.getItem("dailyplanner"));
        }
    }

    function setDailyPlannerToLocalStorage(dailyplanner) {
        localStorage.setItem("dailyplanner", JSON.stringify(dailyplanner));
    }

    getDailyPlannerFromLocalStorage();
    let sum = "";
    dailyPlanner.forEach((elem, idx) => {
        sum += `<div class="daily-planning-cell glass">
                    <p>${elem.time}</p>
                    <input type="text" name="daily-plan-text" id="${idx}" placeholder="Enter your plan" value="${elem.plan}">
                </div>`;
    });

    dailyPlannerContainer.innerHTML = sum;

    const dailyPlannerCells = document.querySelectorAll(".daily-planning-cell input");
    dailyPlannerCells.forEach((elem) => {
        elem.addEventListener("input", () => {
            dailyPlanner[elem.id].plan = elem.value;
            setDailyPlannerToLocalStorage(dailyPlanner);
            getDailyPlannerFromLocalStorage();
        });
    });
}

/**
 * Motivational Quotes UI and Logic
 */
function motivationalQuotesUI() {
    return `<section class="detail-container">
                <section class="quote-container">
                    <div class="quote-card glass">
                        <div class="quote-card-inner glass">
                            <div class="quote-title">
                                <h4 class="title">Quote of the Moment</h4>
                                <img src="${theme === 'dark' ? './assets/images/quote-light-ic.png' : './assets/images/quote-dark-ic.png'}" alt="">
                            </div>
                            <h2 class="quote"></h2>
                            <div class="author-title">
                                <h4></h4>
                                <h4 class="author"></h4>
                            </div>
                        </div>
                        <button class="next-quote-btn glass">Next Quote</button>
                    </div>
                </section>
            </section>`;
}

function motivationalQuotes() {
    const quoteElem = document.querySelector(".quote-container .quote-card .quote");
    const authorElem = document.querySelector(".quote-container .quote-card .author");
    const nextQuote = document.querySelector(".quote-container .next-quote-btn");

    async function fetchQuote() {
        try {
            // const response = await fetch("https://dummyjson.com/quotes/random");
            const response = await fetch("https://motivational-spark-api.vercel.app/api/quotes/random");
            const { quote, author } = await response.json();
            quoteElem.textContent = quote;
            authorElem.textContent = "- " + author;
        }
        catch (error) {
            quoteElem.textContent = "Failed to load quote.";
            authorElem.textContent = "";
        }
    }

    nextQuote.addEventListener("click", () => { fetchQuote() })

    fetchQuote();
}

/**
 * Pomodoro UI and Logic
 */
function pomodoroUI() {
    return `<section class="detail-container">
                <section class="pomodoro-container glass">
                    <div class="timer-container glass">
                        <h2></h2>
                        <h4></h4>
                    </div>
                    <div class="action-btns">
                        <button class="pomodoro-btn start-btn glass">Start</button>
                        <button class="pomodoro-btn pause-btn glass">Pause</button>
                        <button class="pomodoro-btn reset-btn glass">Reset</button>
                    </div>
                </section>
            </section>`;
}

function pomodoroTimer() {
    const time = document.querySelector(".pomodoro-container .timer-container h2");
    const session = document.querySelector(".pomodoro-container .timer-container h4");

    const startBtn = document.querySelector(".pomodoro-container .action-btns .start-btn");
    const pauseBtn = document.querySelector(".pomodoro-container .action-btns .pause-btn");
    const resetBtn = document.querySelector(".pomodoro-container .action-btns .reset-btn");

    let timerInterval = null;
    let workSessionTime = 1800;
    let isWorkSession = true;
    let breakTime = 300;

    let minutes = Math.floor(workSessionTime / 60);
    let seconds = Math.floor(workSessionTime % 60);

    function updateTimer() {
        minutes = Math.floor(workSessionTime / 60);
        seconds = Math.floor(workSessionTime % 60);

        if (minutes === 0 && seconds === 0) {
            isWorkSession = !isWorkSession;
            clearInterval(timerInterval);
            if (!isWorkSession) {
                workSessionTime = breakTime;
            } else {
                workSessionTime = 1800;
            }
            minutes = Math.floor(workSessionTime / 60);
            seconds = Math.floor(workSessionTime % 60);
        }
        updateUI();
    }

    function updateUI() {
        time.innerHTML = `${String(minutes).padStart("2", "0")}:${String(seconds).padStart("2", "0")}`;
        session.innerHTML = isWorkSession ? "Work Session" : "Break Time";
    }

    updateTimer();

    function startTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (workSessionTime > 0) {
                workSessionTime--;
                updateTimer();
            }
        }, 1000);
    }

    function pauseTimer() {
        clearInterval(timerInterval);
    }

    function resetTimer() {
        workSessionTime = 1800;
        isWorkSession = true;
        clearInterval(timerInterval);
        updateTimer();
    }

    startBtn.addEventListener("click", startTimer);
    pauseBtn.addEventListener("click", pauseTimer);
    resetBtn.addEventListener("click", resetTimer);
}

/**
 * Goals UI and Logic
 */
function goalsUI() {
    return `<section class="detail-container">
                <section class="goal-container">
                    <section class="goal-form glass">
                        <h2 class="add-goal-title">ADD GOAL</h2>
                        <form action="#">
                            <input class="glass" type="text" placeholder="Goal Title" name="goal-title" id="goal-title" autofocus required>
                            <textarea class="glass" placeholder="Goal Description" name="goal-desc" id="goal-desc" rows="5" required></textarea>
                            <button class="glass" type="submit">Add Goal</button>
                        </form>
                    </section>
                    <section class="goal-items glass"></section>
                </section>
            </section>`;
}

function goalsList() {
    const form = document.querySelector(".goal-form form");
    const titleInput = document.querySelector("#goal-title");
    const descInput = document.querySelector("#goal-desc");
    const submitButton = document.querySelector(".goal-form form button");
    const goalTitleHeading = document.querySelector(".add-goal-title");
    const goalsItems = document.querySelector(".goal-items");

    let editingGoalId = null;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = titleInput.value.trim();
        const desc = descInput.value.trim();

        if (!title || !desc) return;

        if (editingGoalId) {
            updateGoal(editingGoalId, title, desc);
        } else {
            addGoal(title, desc);
        }
    });

    function addGoal(title, desc) {
        goals.push({
            gid: "gid-" + Math.floor(Math.random() * 10000000000),
            title,
            description: desc,
            isCompleted: false,
            createdAt: Date.now()
        });

        resetGoalForm();
        setGoalsFromLocalStorage(goals);
        showGoals();
    }

    function updateGoal(goalId, title, desc) {
        const goal = goals.find((item) => item.gid === goalId);

        if (goal) {
            goal.title = title;
            goal.description = desc;
            setGoalsFromLocalStorage(goals);
            showGoals();
        }

        resetGoalForm();
    }

    function resetGoalForm() {
        titleInput.value = "";
        descInput.value = "";
        editingGoalId = null;
        submitButton.textContent = "Add Goal";
        goalTitleHeading.textContent = "ADD GOAL";
        titleInput.focus();
    }

    function editGoal(goalId) {
        const goal = goals.find((item) => item.gid === goalId);

        if (!goal) return;

        titleInput.value = goal.title;
        descInput.value = goal.description;
        editingGoalId = goal.gid;
        submitButton.textContent = "Update Goal";
        goalTitleHeading.textContent = "EDIT GOAL";
        titleInput.focus();
    }

    function deleteGoal(goalId) {
        goals = goals.filter((item) => item.gid !== goalId);
        setGoalsFromLocalStorage(goals);
        showGoals();
    }

    function showGoals() {
        getGoalsFromLocalStorage();
        let sum = "";
        goals.forEach((goal) => {
            sum += `<div class="goal glass" data-goal-id="${goal.gid}">
                    <div class="goal-info">
                        <h2 class="goal-title">${goal.title}</h2>
                        <p class="goal-desc">${goal.description}</p>
                    </div>
                    <div class="goal-actions">
                        ${goal.isCompleted ? `<button class="completed-bt glass">Completed</button>` : `<button class="mark-complete-bt glass">Mark Complete</button>`}
                        <button class="edit-goal-bt glass">Edit</button>
                        <button class="delete-goal-bt glass">Delete</button>
                    </div>
               </div>`;
        });
        goalsItems.innerHTML = sum || "<h3>No goal added yet</h3>";
    }

    goalsItems.addEventListener("click", (e) => {
        const actionButton = e.target.closest("button");
        if (!actionButton) return;

        const goalCard = actionButton.closest(".goal");
        const goalId = goalCard?.dataset.goalId;

        if (!goalId) return;

        if (actionButton.classList.contains("mark-complete-bt")) {
            markCompleted(goalId);
        } else if (actionButton.classList.contains("edit-goal-bt")) {
            editGoal(goalId);
        } else if (actionButton.classList.contains("delete-goal-bt")) {
            deleteGoal(goalId);
        }
    });

    function markCompleted(goalId) {
        const goal = goals.find((item) => item.gid === goalId);
        if (goal) {
            goal.isCompleted = true;
            setGoalsFromLocalStorage(goals);
            showGoals();
        }
    }

    function getGoalsFromLocalStorage() {
        if (localStorage.getItem("goals")) {
            goals = JSON.parse(localStorage.getItem("goals"));
            goalsItems.style.justifyContent = "flex-start";
        } else {
            goals = [];
            goalsItems.style.justifyContent = "center";
        }
    }

    function setGoalsFromLocalStorage(goalsList) {
        localStorage.setItem("goals", JSON.stringify(goalsList));
    }

    showGoals();
}

/**
 * Dashboard Logic
 */
function dashboard() {
    const city = "Bhopal";
    const region = "MP";

    setLocation();
    setDate();
    setInterval(() => {
        setTime();
        autoTheme();
    }, 1000);

    async function callWeatherAPI() {
        try {
            // const key = "PLACE KEY HERE AND UNCOMMENT below method calling - callWeatherAPI";
            const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${key}&q=${city}`);

            const data = await res.json();
            setHeaderUI(data);
        } catch (error) {
            alert("Failed to load weather api data...");
        }
    }
    // callWeatherAPI();

    function setHeaderUI(data) {
        const temp = document.querySelector(".widgets .weather-card .temp");
        const weatherIcon = document.querySelector(".widgets .weather-card .weather-icon");
        const weather = document.querySelector(".widgets .weather-card .weather-txt");

        const wind = document.querySelector(".widgets .weather-card .bottom .wind .wind-txt");
        const humidity = document.querySelector(".widgets .weather-card .bottom .humidity .humidity-txt");

        temp.innerHTML = `${data.current.temp_c}<span>°C</span>`;
        weather.textContent = `${data.current.condition.text}`;
        weatherIcon.className = `icon weather-icon ${getWeatherIconClass(data.current.condition.text)}`;
        wind.textContent = `${data.current.wind_dir} ${data.current.wind_kph} kph`;
        humidity.textContent = `${data.current.humidity}%`;
    }
    function getWeatherIconClass(conditionText) {
        const text = conditionText.toLowerCase();
        if (text.includes("sun") || text.includes("clear")) return "ri-sun-line";
        if (text.includes("rain") || text.includes("drizzle")) return "ri-umbrella-line";
        if (text.includes("cloud")) return "ri-cloud-line";
        if (text.includes("mist") || text.includes("fog")) return "ri-mist-line";
        return "ri-sun-cloudy-line";
    }
    function setTime() {
        const timeText = document.querySelector(".navbar .time .cur-time");
        const now = new Date();
        const timeFormatter = new Intl.DateTimeFormat("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        });

        const formattedTime = timeFormatter.format(now);
        timeText.innerHTML = `${formattedTime}`;
    }

    function setDate() {
        const dateText = document.querySelector(".navbar .date .cur-date");
        const dayText = document.querySelector(".navbar .date .cur-day");
        const monthYearText = document.querySelector(".navbar .date .cur-month-year");

        const now = new Date();
        const date = now.getDate();
        const year = now.getFullYear();
        const month = new Intl.DateTimeFormat("en-IN", { month: "long" }).format(now);
        const day = new Intl.DateTimeFormat("en-IN", { weekday: "long" }).format(now);

        dayText.textContent = day + ",";
        dateText.textContent = date;
        monthYearText.textContent = `${month}, ${year}`;
    }

    function setLocation() {
        const location = document.querySelector(".widgets .weather-card .location-txt");
        location.innerHTML = `${city}, ${region}`;
    }
}

/**
 * Calling Dashboard
 */

dashboard();


