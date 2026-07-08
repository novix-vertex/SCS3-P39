const popup = document.querySelector("#popup");
const popupContent = document.querySelector("#popup-content");
const popupClose = document.querySelector(".close");

document.querySelectorAll(".feature").forEach((f) => {
    f.addEventListener("click", () => {
        popup.classList.add("show");
        if (f.dataset.feature == "todo-list") {
            popupContent.innerHTML = `Todo List`;
        }
        if (f.dataset.feature == "daily-planner") {
            popupContent.innerHTML = `Daily Planner`;
        }
        if (f.dataset.feature == "motivational-quotes") {
            popupContent.innerHTML = `Motivational Quotes`;
        }
        if (f.dataset.feature == "pomodoro-timer") {
            popupContent.innerHTML = pomodoroUI();
            pomodoroTimer();
        }
        if (f.dataset.feature == "goals") {
            popupContent.innerHTML = `Goals`;
        }
    })
});

popupClose.addEventListener("click", () => {
    popup.classList.remove("show");
});


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
