// =====================================
// 1. API CONFIGURATION
// =====================================

const BASE_URL = "/.netlify/functions/weather";

// =====================================
// 2. SELECT HTML ELEMENTS
// =====================================

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const loading = document.getElementById("loading");
const error = document.getElementById("error");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weatherDescription");
const weatherIcon = document.getElementById("weatherIcon");

const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");

const forecastContainer = document.getElementById("forecastContainer");
const citiesContainer = document.getElementById("citiesContainer");
const locationBtn = document.getElementById("locationBtn");

// =====================================
// 3. LOADING AND ERROR STATES
// =====================================

function showLoading() {
loading.classList.remove("hidden");
error.classList.add("hidden");
}

function hideLoading() {
loading.classList.add("hidden");
}

function showError(message) {
error.textContent = message;
error.classList.remove("hidden");
}

// =====================================
// 4. FETCH CURRENT WEATHER
// =====================================

async function getCurrentWeather(city) {
    const url = `${BASE_URL}?type=current&city=${encodeURIComponent(city)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
    throw new Error(
        data.error || data.message || "Something went wrong."
    );
}

    return data;
}

// =====================================
// 5. FETCH WEATHER BY COORDINATES
// =====================================

async function getWeatherByCoordinates(lat, lon) {
    const url = `${BASE_URL}?type=current&lat=${lat}&lon=${lon}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
    throw new Error(
        data.error || data.message || "Something went wrong."
    );
}

    return data;
}


// =====================================
// 7. FETCH 5-DAY FORECAST
// =====================================

async function getForecast(lat, lon) {
    const url = `${BASE_URL}?type=forecast&lat=${lat}&lon=${lon}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
    throw new Error(
        data.error || data.message || "Something went wrong."
    );
}

    return data;
}

// =====================================
// 6. DISPLAY CURRENT WEATHER
// =====================================

function displayCurrentWeather(data) {
cityName.textContent = `${data.name}, ${data.sys.country}`;


temperature.textContent = `${Math.round(data.main.temp)}°C`;

weatherDescription.textContent =
    data.weather[0].description;

weatherIcon.src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

weatherIcon.alt = data.weather[0].description;

feelsLike.textContent =
    `${Math.round(data.main.feels_like)}°C`;

humidity.textContent =
    `${data.main.humidity}%`;

windSpeed.textContent =
    `${data.wind.speed} m/s`;


}

// =====================================
// 8. DISPLAY 3-DAY FORECAST
// =====================================

function displayForecast(data) {
forecastContainer.innerHTML = "";


const timezoneOffset = data.city.timezone;

const groupedForecasts = {};

data.list.forEach(item => {
    const localDate = new Date(
        (item.dt + timezoneOffset) * 1000
    );

    const dateKey = localDate.toISOString().split("T")[0];

    if (!groupedForecasts[dateKey]) {
        groupedForecasts[dateKey] = [];
    }

    groupedForecasts[dateKey].push({
        ...item,
        localHour: localDate.getUTCHours()
    });
});

const today = new Date(
    (Date.now() / 1000) + timezoneOffset
).toISOString().split("T")[0];

const forecastDays = Object.keys(groupedForecasts)
    .filter(date => date > today)
    .slice(0, 3);

forecastDays.forEach(date => {
    const entries = groupedForecasts[date];

    // Select the forecast closest to midday.
    const selected = entries.reduce((closest, current) => {
        return Math.abs(current.localHour - 12) <
            Math.abs(closest.localHour - 12)
            ? current
            : closest;
    });

    const dayName = new Date(
        `${date}T12:00:00Z`
    ).toLocaleDateString("en-US", {
        weekday: "long",
        timeZone: "UTC"
    });

    const card = document.createElement("div");
    card.className = "forecast-card";

    card.innerHTML = `
        <h3>${dayName}</h3>
        <img
            src="https://openweathermap.org/img/wn/${selected.weather[0].icon}@2x.png"
            alt="${selected.weather[0].description}"
        >
        <h3>${Math.round(selected.main.temp)}°C</h3>
        <p>${selected.weather[0].description}</p>
    `;

    forecastContainer.appendChild(card);
});

if (forecastDays.length === 0) {
    forecastContainer.textContent = "Forecast unavailable.";
}


}

// =====================================
// 9. LOAD WEATHER FOR A CITY
// =====================================

async function loadWeather(city) {
try {
showLoading();
hideLoading();


    const currentData = await getCurrentWeather(city);

    displayCurrentWeather(currentData);

    const forecastData = await getForecast(
        currentData.coord.lat,
        currentData.coord.lon
    );

    displayForecast(forecastData);

    error.classList.add("hidden");

} catch (err) {
    showError(err.message);
} finally {
    hideLoading();
}


}

// =====================================
// 10. SEARCH FUNCTIONALITY
// =====================================

searchBtn.addEventListener("click", () => {
const city = cityInput.value.trim();


if (!city) {
    showError("Please enter a city name.");
    return;
}

loadWeather(city);
cityInput.value = "";


});

cityInput.addEventListener("keydown", event => {
if (event.key === "Enter") {
searchBtn.click();
}
});

// =====================================
// 11. MULTIPLE CITY WEATHER CARDS
// =====================================

async function loadPopularCities() {
    const cities = ["London", "New York", "Tokyo"];

    citiesContainer.innerHTML = "";

    const results = await Promise.allSettled(
        cities.map(city => getCurrentWeather(city))
    );

    results.forEach(result => {
        if (result.status === "fulfilled") {
            const data = result.value;

            const card = document.createElement("div");
            card.className = "city-card";

            card.innerHTML = `
                <h3>${data.name}</h3>

                <img
                    src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png"
                    alt="${data.weather[0].description}"
                >

                <h2>${Math.round(data.main.temp)}°C</h2>

                <p>${data.weather[0].description}</p>

                <p>Humidity: ${data.main.humidity}%</p>
            `;

            citiesContainer.appendChild(card);
        }
    });
}



// =====================================
// 12. CURRENT LOCATION SUPPORT
// =====================================

locationBtn.addEventListener("click", () => {
if (!navigator.geolocation) {
showError("Geolocation is not supported by your browser.");
return;
}


showLoading();

navigator.geolocation.getCurrentPosition(
    async position => {
        try {
            const { latitude, longitude } = position.coords;

            const currentData = await getWeatherByCoordinates(
                latitude,
                longitude
            );

            displayCurrentWeather(currentData);

            const forecastData = await getForecast(
                latitude,
                longitude
            );

            displayForecast(forecastData);

            error.classList.add("hidden");

        } catch (err) {
            showError(err.message);
        } finally {
            hideLoading();
        }
    },

    () => {
        hideLoading();
        showError("Location access was denied or unavailable.");
    }
);


});

// =====================================
// 13. INITIALIZE DASHBOARD
// =====================================

loadWeather("Lagos");
loadPopularCities();
