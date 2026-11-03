exports.handler = async (event) => {
const API_KEY = process.env.OPENWEATHER_API_KEY;


if (!API_KEY) {
    return {
        statusCode: 500,
        body: JSON.stringify({
            error: "Weather API key is not configured."
        })
    };
}

const { type, city, lat, lon } = event.queryStringParameters || {};

let endpoint;

if (type === "current" && city) {
    endpoint = "weather";
} else if (
    type === "current" &&
    lat !== undefined &&
    lon !== undefined
) {
    endpoint = "weather";
} else if (
    type === "forecast" &&
    lat !== undefined &&
    lon !== undefined
) {
    endpoint = "forecast";
} else {
    return {
        statusCode: 400,
        body: JSON.stringify({
            error: "Invalid weather request."
        })
    };
}

const params = new URLSearchParams({
    appid: API_KEY,
    units: "metric"
});

if (city) {
    params.set("q", city);
} else {
    params.set("lat", lat);
    params.set("lon", lon);
}

try {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/${endpoint}?${params}`
    );

    const data = await response.json();

    if (!response.ok) {
        return {
            statusCode: response.status,
            body: JSON.stringify({
                error: data.message || "Unable to retrieve weather data."
            })
        };
    }

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };

} catch (error) {
    return {
        statusCode: 500,
        body: JSON.stringify({
            error: "Unable to connect to the weather service."
        })
    };
}


};
