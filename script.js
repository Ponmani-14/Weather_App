// SOUNDS
let rainSound = new Audio("./videos/sounds/rain.mp3");
let windSound = new Audio("./videos/sounds/wind.mp3");
let sunSound = new Audio("./videos/sounds/sunny.mp3");
let fogSound = new Audio("./videos/sounds/fog.mp3");

// STOP ALL SOUNDS FUNCTION
function stopAllSounds() {
    [rainSound, windSound, sunSound, fogSound].forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
    });
}

// SET WEATHER VIDEO FUNCTION
function setWeatherVideo(type) {
    const video = document.getElementById("weatherVideo");
    if (!video) return;

    switch(type) {
        case "rain":
            video.src = "./videos/rain.mp4";
            break;
        case "cloud":
            video.src = "./videos/cloud.mp4";
            break;
        case "sun":
            video.src = "./videos/sunny.mp4";
            break;
        case "fog":
            video.src = "./videos/fog.mp4";
            break;
        default:
            video.src = "./videos/default.mp4";
    }

    video.load();  // ensure the new video is loaded
    video.play().catch(err => console.warn("Video play interrupted:", err));
}

// MAIN WEATHER FUNCTION
async function getWeather() {
    const city = document.getElementById("city").value.trim();
    if (!city) {
        alert("Please enter a city name!");
        return;
    }

    try {
        // Use relative URL so request goes to your backend
        const res = await fetch(`/weather/${city}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();

        const temp = data.main?.temp ?? "N/A";
        const condition = data.weather?.[0]?.main?.toLowerCase() ?? "unknown";
        const icon = data.weather?.[0]?.icon ?? "01d";

        stopAllSounds();

        // Play video and sound based on weather
        if (condition.includes("rain") || condition.includes("shower")) {
            setWeatherVideo("rain");
            rainSound.play();
        } else if (condition.includes("cloud") || condition.includes("overcast")) {
            setWeatherVideo("cloud");
            windSound.play();
        } else if (condition.includes("clear")) {
            setWeatherVideo("sun");
            sunSound.play();
        } else if (condition.includes("fog") || condition.includes("mist") || condition.includes("smoke") || condition.includes("smoke")) {
            setWeatherVideo("fog");
            fogSound.play();
        } else {
            setWeatherVideo("default");
        }

        // Display results
        document.getElementById("result").innerHTML = `
            <h3 class="fw-bold">${data.name || city}</h3>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather icon"/>
            <h1 class="fw-bold">${temp}°C</h1>
            <h4 class="text-uppercase text-muted">${condition}</h4>
        `;

    } catch (error) {
        console.error("Error fetching weather:", error);
        document.getElementById("result").innerHTML = `
            <p class="text-danger fw-bold">Failed to fetch weather data ❌<br>${error.message}</p>
        `;
    }
}
