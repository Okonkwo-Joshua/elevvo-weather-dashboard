exports.handler = async (event) => {

    try {

        const API_KEY = process.env.OPENWEATHER_API_KEY;

        if (!API_KEY) {

            return {
                statusCode: 500,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    error: "Weather API key is not configured."
                })
            };

        }

        const {
            type,
            city,
            lat,
            lon
        } = event.queryStringParameters || {};

        let endpoint;

        // Current weather by city

        if (type === "current" && city) {

            endpoint = "weather";

        }

        // Current weather by coordinates

        else if (
            type === "current" &&
            lat !== undefined &&
            lon !== undefined
        ) {

            endpoint = "weather";

        }

        // Forecast by coordinates

        else if (
            type === "forecast" &&
            lat !== undefined &&
            lon !== undefined
        ) {

            endpoint = "forecast";

        }

        else {

            return {
                statusCode: 400,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    error: "Invalid weather request."
                })
            };

        }

        // Build API parameters

        const params = new URLSearchParams({
            appid: API_KEY,
            units: "metric"
        });

        if (city && type === "current") {

            params.set("q", city);

        } else {

            params.set("lat", lat);
            params.set("lon", lon);

        }

        // Fetch data from OpenWeatherMap

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/${endpoint}?${params}`
        );

        const data = await response.json();

        // Handle API errors

        if (!response.ok) {

            return {
                statusCode: response.status,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    error: data.message || "Unable to retrieve weather data."
                })
            };

        }

        // Return successful response

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };

    } catch (err) {

        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                error: "Unable to connect to the weather service."
            })
        };

    }

};
