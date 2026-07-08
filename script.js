todolist = [];
goals = [];

const popup = document.querySelector("#popup");
const popupContent = document.querySelector("#popup-content");
const popupClose = document.querySelector(".close");

document.querySelectorAll(".feature").forEach((f) => {
    f.addEventListener("click", () => {
        popup.classList.add("show");
        if (f.dataset.feature == "todo-list") {
            popupContent.innerHTML = todoListUI();
            todoList();
        }
        if (f.dataset.feature == "daily-planner") {
            popupContent.innerHTML = dailyPlannerUI();
            dailyPlanner();
        }
        if (f.dataset.feature == "motivational-quotes") {
            popupContent.innerHTML = motivationalQuotesUI();
            motivationalQuotes();
        }
        if (f.dataset.feature == "pomodoro-timer") {
            popupContent.innerHTML = pomodoroUI();
            pomodoroTimer();
        }
        if (f.dataset.feature == "goals") {
            popupContent.innerHTML = goalsUI();
            goalsList();
        }
    })
});

popupClose.addEventListener("click", () => {
    popup.classList.remove("show");
});


/**
 * Todo List UI and Logic
 */
function todoListUI() {
    return `<section class="detail-container">
                <section class="header">
                    <h2 class="page-title">Todo List</h2>
                </section>
                <section class="todo-list-container">
                    <section class="todo-list-form">
                        <h2 class="add-task-title">ADD TASK</h2>
                        <form action="#">
                            <input type="text" placeholder="Task Title" name="todo-title" id="todo-title" autofocus
                                required>
                            <textarea placeholder="Task Description" name="todo-desc" id="todo-desc" rows="5"
                                required></textarea>
                            <label>
                                <input type="checkbox" name="todo-isimp" id="todo-isimp">
                                Mark as Important
                            </label>
                            <button type="submit">Add Task</button>
                        </form>
                    </section>
                    <section class="todo-list-items">
                    </section>
                </section>
            </section>`;
}
function todoList() {
    const form = document.querySelector("form");

    form.addEventListener("submit", (e, idx) => {
        e.preventDefault();
        const title = document.querySelector("#todo-title");
        const desc = document.querySelector("#todo-desc");
        const isImportant = document.querySelector("#todo-isimp");
        addTask(title, desc, isImportant);
    });

    function addTask(title, desc, isImportant) {
        todolist.push({
            "title": title.value.trim(),
            "description": desc.value.trim(),
            "isCompleted": false,
            "isImportant": isImportant.checked
        });
        title.value = "";
        desc.value = "";
        isImportant.checked = false;
        setTaskListFromLocalStorage(todolist);

        showTaskList();
        title.focus();
    }

    const todo_list_items = document.querySelector(".todo-list-items");

    function showTaskList() {
        getTaskListFromLocalStorage();
        let sum = '';
        todolist.forEach((todo, idx) => {
            sum += `<div class="task" id=${idx}>
                    <div class="task-info">
                        <h2 class="task-title">${todo.title}</h2>
                        ${todo.isImportant ? `<span id=${idx} class="task-imp">Imp</span>` : ``}
                    </div>
                    ${todo.isCompleted ? `<button id=${idx} class="completed-bt">Completed</button>` : `<button id=${idx} class="mark-complete-bt">Mark Complete</button>`}
               </div>`;
            todo_list_items.innerHTML = sum;

        });
    }

    todo_list_items.addEventListener("click", (e) => {
        if (e.target.classList.contains("mark-complete-bt")) {
            markCompleted(e.target.id);
        }
    });


    function markCompleted(idx) {
        todolist[idx].isCompleted = true;
        setTaskListFromLocalStorage(todolist);
        showTaskList();
    }


    function getTaskListFromLocalStorage() {
        if (localStorage.getItem("tasklist")) {
            todolist = JSON.parse(localStorage.getItem("tasklist"));
            todo_list_items.style.justifyContent = "flex-start";
        }
        else {
            todo_list_items.style.justifyContent = "center";
            todo_list_items.style.color = "#fff";
            todo_list_items.innerHTML = "<h1>No task added yet</h1>";
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
                <section class="header">
                    <h2 class="page-title">Daily Planner</h2>
                </section>
                <section class="daily-planner-container">
                </section>
            </section>`;
}
function dailyPlanner() {
    const start = 6;
    const end = 24;

    let daily_planner = [];

    for (let i = start; i < end; i++) {
        daily_planner.push(
            {
                "time": `${i}:00 - ${i + 1}:00`,
                "plan": ""
            }
        )
    }
    let daily_planner_container = document.querySelector(".daily-planner-container");


    function getDailyPlannerFromLocalStorage() {
        if (localStorage.getItem("dailyplanner")) {
            daily_planner = JSON.parse(localStorage.getItem("dailyplanner"));
        }
    }
    function setDailyPlannerToLocalStorage(dailyplanner) {
        localStorage.setItem("dailyplanner", JSON.stringify(dailyplanner));
    }

    getDailyPlannerFromLocalStorage();
    let sum = "";
    daily_planner.forEach((elem, idx) => {
        sum += `<div class="daily-planning-cell">
                    <p>${elem.time}</p>
                    <input type="text" name="daily-plan-text" id = ${idx} placeholder="..." value=${elem.plan}>
                </div>`;
    });

    daily_planner_container.innerHTML = sum;

    let daily_planner_cells = document.querySelectorAll(".daily-planning-cell input");

    daily_planner_cells.forEach((elem) => {
        elem.addEventListener("input", () => {
            console.log(elem.id, elem.value);
            daily_planner[elem.id].plan = elem.value;
            setDailyPlannerToLocalStorage(daily_planner);
            getDailyPlannerFromLocalStorage();
        });
    })

}


/**
 * Motivational Quotes UI and Logic
 */
function motivationalQuotesUI() {
    return `<section class="detail-container">
                <section class="header">
                    <h2 class="page-title">Motivational Quote</h2>
                </section>
                <section class="quote-container">
                    <div class="quote-card">
                        <div class="quote-card-inner">
                            <div class="quote-title">
                                <h4 class="title">Quote of the Moment</h4>
                                <img src="./assets/images/icons8-quote-50.png" alt="">
                            </div>
                            <h2 class="quote"></h2>
                            <div class="author-title">
                                <h4></h4>
                                <h4 class="author"></h4>
                            </div>
                        </div>
                    </div>
                </section>
            </section>`;
}
function motivationalQuotes() {
    let quoteElem = document.querySelector('.quote-container .quote-card .quote');
    let authorElem = document.querySelector('.quote-container .quote-card .author');

    async function fetchQuote() {
        const response = await fetch("https://dummyjson.com/quotes/random");
        const { quote, author } = await response.json();
        quoteElem.innerHTML = quote;
        authorElem.innerHTML = "- " + author;
    }
    fetchQuote();
}

/**
 * Pomodoro UI and Logic
 */
function pomodoroUI() {
    return `<section class="detail-container">
                <section class="header">
                    <h2 class="page-title">Pomodoro Timer</h2>
                </section>
                <section class="pomodoro-container">
                    <div class="timer-container">
                        <h2></h2>
                        <h4></h4>
                    </div>
                    <div class="action-btns">
                        <button class="pomodoro-btn start-btn">Start</button>
                        <button class="pomodoro-btn pause-btn">Pause</button>
                        <button class="pomodoro-btn reset-btn">Reset</button>
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

        if (minutes == 0 && seconds == 0) {
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
        time.innerHTML = `${String(minutes).padStart("2", "0")}:${String(seconds).padStart("2", "0")}`
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
        }, 10);
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
 * Todo List UI and Logic
 */
function goalsUI() {
    return `<section class="detail-container">
                <section class="header">
                    <h2 class="page-title">Goals</h2>
                </section>
                <section class="goal-container">
                    <section class="goal-form">
                        <h2 class="add-goal-title">ADD GOAL</h2>
                        <form action="#">
                            <input type="text" placeholder="Goal Title" name="goal-title" id="goal-title" autofocus
                                required>
                            <textarea placeholder="Goal Description" name="goal-desc" id="goal-desc" rows="5"
                                required></textarea>
                            <button type="submit">Add Goal</button>
                        </form>
                    </section>
                    <section class="goal-items">
                    </section>
                </section>
            </section>`;
}
function goalsList() {
    const form = document.querySelector("form");

    form.addEventListener("submit", (e, idx) => {
        e.preventDefault();
        const title = document.querySelector("#goal-title");
        const desc = document.querySelector("#goal-desc");
        addGoal(title, desc);
    });

    function addGoal(title, desc) {
        goals.push({
            "title": title.value.trim(),
            "description": desc.value.trim(),
            "isCompleted": false
        });
        title.value = "";
        desc.value = "";
        setGoalsFromLocalStorage(goals);

        showGoals();
        title.focus();
    }

    const goals_items = document.querySelector(".goal-items");

    function showGoals() {
        getGoalsFromLocalStorage();
        let sum = '';
        goals.forEach((goal, idx) => {
            sum += `<div class="goal" id=${idx}>
                    <div class="goal-info">
                        <h2 class="goal-title">${goal.title}</h2>
                    </div>
                    ${goal.isCompleted ? `<button id=${idx} class="completed-bt">Completed</button>` : `<button id=${idx} class="mark-complete-bt">Mark Complete</button>`}
               </div>`;
            goals_items.innerHTML = sum;

        });
    }

    goals_items.addEventListener("click", (e) => {
        if (e.target.classList.contains("mark-complete-bt")) {
            markCompleted(e.target.id);
        }
    });


    function markCompleted(idx) {
        goals[idx].isCompleted = true;
        setGoalsFromLocalStorage(goals);
        showGoals();
    }


    function getGoalsFromLocalStorage() {
        if (localStorage.getItem("goals")) {
            goals = JSON.parse(localStorage.getItem("goals"));
            goals_items.style.justifyContent = "flex-start";
        }
        else {
            goal_items.style.justifyContent = "center";
            goal_items.style.color = "#fff";
            goal_items.innerHTML = "<h1>No goal added yet</h1>";
        }
    }

    function setGoalsFromLocalStorage(goals) {
        localStorage.setItem("goals", JSON.stringify(goals));
    }

    showGoals();
}


/**
 * Dashboard Logic
 */

function dashboard() {
    const city = "Mumbai";
    const region = "MH";

    setLocation();
    setDate();
    setInterval(() => {
        setTime();
    }, 1000);

    async function callWeatherAPI() {
        // const key = "PLACE KEY HERE AND UNCOMMENT below method calling - callWeatherAPI";
        let res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${key}&q=${city}`);

        let data = await res.json();
        setHeaderUI(data);
    }
    // callWeatherAPI();

    function setHeaderUI(data) {
        const temp = document.querySelector(".date-time-weather-card .weather .left .temp");
        const weatherIcon = document.querySelector(".date-time-weather-card .weather .weather-icon");
        const weather = document.querySelector(".date-time-weather-card .weather .left .weather-txt");

        temp.innerHTML = `${data.current.temp_c}<span>°C</span>`;
        weather.innerHTML = `${data.current.condition.text}`;
        weatherIcon.src = `${data.current.condition.icon}`;
    }

    function setTime() {
        const timeText = document.querySelector(".date-time-weather-card .bottom .time .cur-time");

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
        const dateText = document.querySelector(".date-time-weather-card .bottom .date .cur-date");
        const dayText = document.querySelector(".date-time-weather-card .bottom .date .cur-day");
        const monthYearText = document.querySelector(".date-time-weather-card .bottom .date .cur-month-year");

        const now = new Date();

        const date = now.getDate();
        const year = now.getFullYear();

        const month = new Intl.DateTimeFormat("en-IN", {
            month: "long"
        }).format(now);

        const day = new Intl.DateTimeFormat("en-IN", {
            weekday: "long"
        }).format(now);

        dateText.textContent = date;
        dayText.textContent = day;
        monthYearText.textContent = `${month}, ${year}`;
    }


    function setLocation() {
        const location = document.querySelector(".date-time-weather-card .location .location-txt");

        location.innerHTML = `${city}, ${region}`;
    }
}

/**
 * Calling Dashboard
 */

dashboard();
