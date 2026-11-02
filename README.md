# 🌤️ Weatherly — Real-Time Weather Dashboard

Weatherly is a responsive weather dashboard that provides real-time weather information for cities around the world. It features current weather conditions, a multi-day forecast, popular city weather summaries and location-based weather updates.

Built with HTML, CSS and JavaScript, Weatherly provides a clean and user-friendly experience across desktop and mobile devices.

## ✨ Features

* **Current Weather:** View temperature, weather conditions and weather icons.
* **City Search:** Search for weather information in different cities.
* **3-Day Forecast:** Check upcoming weather conditions.
* **Popular Cities:** Quickly view weather summaries for London, New York and Tokyo.
* **Location-Based Weather:** Get weather information using your current location.
* **Weather Details:** View feels-like temperature, humidity and wind speed.
* **Responsive Design:** Optimised for desktop, tablet and mobile screens.
* **Loading and Error States:** Clear feedback while weather information is being retrieved.

## 🛠️ Technologies Used

* HTML5
* CSS3
* JavaScript (ES6+)
* OpenWeatherMap API
* Fetch API
* Netlify Functions
* Git and GitHub

## 📁 Project Structure

```text
weather-dashboard/
│
├── index.html
├── style.css
├── script.js
├── README.md
│
└── netlify/
    └── functions/
        └── weather.js
```

## 🔑 API Configuration

Weatherly uses the OpenWeatherMap API to retrieve weather information.

For security, the API key is stored as a Netlify environment variable and accessed through a serverless function rather than being exposed in frontend JavaScript.

To configure the project:

1. Create an account with OpenWeatherMap.
2. Generate an API key.
3. Add the key to your Netlify environment variables as `OPENWEATHER_API_KEY`.
4. Deploy the project through Netlify.

**Important:** Never commit your real API key to a public GitHub repository.

## 🚀 Getting Started

To run the project locally:

1. Clone the repository.
2. Open the project folder.
3. Configure the required API environment variable.
4. Run the project using the appropriate local development setup for Netlify Functions.
5. Open the local development URL in your browser.

## 🌍 Deployment

The project is designed for deployment using Netlify, with Netlify Functions handling secure communication with the OpenWeatherMap API.

## 📚 What I Learned

Through this project, I gained practical experience with:

* Working with third-party APIs.
* Fetching and displaying real-time data.
* Handling asynchronous JavaScript operations.
* Working with geolocation.
* Building responsive user interfaces.
* Managing loading and error states.
* Using Git and GitHub for project management.

## 👨‍💻 Author

**Joshua Okonkwo C**

Junior Frontend Developer

* GitHub: [Okonkwo-Joshua](https://github.com/Okonkwo-Joshua)

---

*Weatherly — Making weather information simple and accessible.*
