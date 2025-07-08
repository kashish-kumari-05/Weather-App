const apiKey = "87d474603ffc7c544dfd4eca326913fc";

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return alert("Please enter a city!");

  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
    const data = await res.json();

    if (data.cod !== "200") {
      alert("City not found or something went wrong!");
      return;
    }

    displayCurrentWeather(data.city.name, data.list[0]);
    displayForecast(data.list);
    updateBackground(data.list[0].weather[0].main);
  } catch (err) {
    console.error("Error:", err);
    alert("Something went wrong while fetching data.");
  }
}

function displayCurrentWeather(city, weather) {
  const div = document.getElementById("current");
  div.innerHTML = `
    <h2>${city}</h2>
    <h3>${weather.weather[0].main}</h3>
    <img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" />
    <p>Temp: ${weather.main.temp}°C</p>
    <p>Humidity: ${weather.main.humidity}%</p>
    <p>Wind: ${weather.wind.speed} m/s</p>
  `;
}

function displayForecast(forecastList) {
  const forecastDiv = document.getElementById("forecast");
  forecastDiv.innerHTML = "";

  const daily = forecastList.filter(item => item.dt_txt.includes("12:00:00"));

  daily.slice(0, 5).forEach(day => {
    const date = new Date(day.dt_txt);
    const dayName = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

    forecastDiv.innerHTML += `
      <div class="day">
        <h3>${dayName}</h3>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" />
        <p>${day.weather[0].main}</p>
        <p>${day.main.temp}°C</p>
      </div>
    `;
  });
}

function updateBackground(weather) {
  const bgMap = {
    Clear: "backgrounds/sunny.jpg",
    Clouds: "backgrounds/clouds.jpg",
    Rain: "backgrounds/rain.jpg",
    Snow: "backgrounds/snow.jpg",
    Thunderstorm: "backgrounds/storm.jpg",
    Drizzle: "backgrounds/drizzle.jpg",
    Mist: "backgrounds/drizzle.jpg",
    Haze: "backgrounds/haze.jpg",
    Fog: "backgrounds/fog.jpg",
    Smoke: "backgrounds/haze.jpg",
    Dust: "backgrounds/dust.jpg"
  };

  const imageUrl = bgMap[weather] || "backgrounds/default.jpg";

  const img = new Image();
  img.onload = () => {
    document.querySelector(".app").style.backgroundImage = `url('${imageUrl}')`;
  };
  img.onerror = () => {
    console.warn("Image failed to load, setting fallback background color.");
    document.querySelector(".app").style.backgroundImage = "none";
    document.querySelector(".app").style.backgroundColor = "#333";
  };
  img.src = imageUrl;
}
