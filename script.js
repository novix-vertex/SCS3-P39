const popup = document.querySelector("#popup");
const popupTitle = document.querySelector("#popup-title");
const popupClose = document.querySelector(".close");

document.querySelectorAll(".feature").forEach((f) => {
    f.addEventListener("click", () => {
        popup.classList.add("show");
        popupTitle.textContent = f.dataset.feature;
    })
});

popupClose.addEventListener("click", () => {
    popup.classList.remove("show");
});


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

dashboard();
