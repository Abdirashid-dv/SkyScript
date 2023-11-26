const apiKey = "21fe43bc651fba0f383f20d542c764d5";
const apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

var submitBtn = document.querySelector(".search-bar button");
var locationBtn = document.querySelector(".location button");
// QuerySelector Info
var city_name = document.querySelector(".city-name");
var tempture = document.querySelector(".weather .temp");
var weatherIcon = document.querySelector(".weather-icon img");
var waetherDescription = document.querySelector(".weather-description");

// QuerySelector Data
var humidity = document.querySelector(".humidity-data");
var pressure = document.querySelector(".pressure-data");
var visibility = document.querySelector(".visibility-data");
var feels_like = document.querySelector(".feels-data");

// Dates
var sunrise_data = document.querySelector(".sunrise-data");
var sunset_data = document.querySelector(".sunset-data");
var date_of_today = document.querySelector("#date_of_today");

// Air-quality
var pmData = document.querySelector(".label-1-data");
var soData = document.querySelector(".label-2-data");
var noData = document.querySelector(".label-3-data");
var oData = document.querySelector(".label-4-data");

// Weather_Widget
var weather_widget_icon = document.getElementsByClassName(
    "widget-weather-icon"
);
var widgetTemperature = document.getElementsByClassName("widget-temperature");

async function getWeatherData(city = "Samsun") {
    var response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    var data = await response.json();

    if (response.status == 404) {
        console.log("Error");
    } else {
        // Api Call
        getHourlyForcast(city);

        city_name.innerHTML = `<i class="fa-solid fa-location-dot"></i>${
            data.name + "," + data.sys.country
        }`;

        tempture.innerHTML = `${Math.round(data.main.temp)}<sup>°c</sup>`;
        waetherDescription.textContent = data.weather[0].description;
        weatherIcon.src = `./Assets/images/${data.weather[0].icon}.png`;

        // Humidity
        humidity.innerHTML = data.main.humidity + "%";
        // Pressure
        pressure.innerHTML = `${data.main.pressure}<span>hPa</span>`;
        // Visibility
        visibility.innerHTML = `${data.visibility / 1000}<span>Km</span>`;
        // Feels Like
        feels_like.innerHTML = `${Math.round(
            data.main.feels_like
        )}<sub>°C</sub>`;

        // Sunrise time
        sunrise_data.textContent =
            formatTime(get_date(data.sys.sunrise)) + " " + "AM";

        // Sunset time
        sunset_data.textContent =
            formatTime(get_date(data.sys.sunset)) + " " + "PM";

        // date
        var dateTime = formatDate(get_date(data.dt));
        date_of_today.innerHTML = `<i class="fa-regular fa-calendar"></i>${
            dateTime.day + " " + dateTime.date + ", " + dateTime.month
        }`;

        // Air Quality

        var airpolution_response = await fetch(
            `http://api.openweathermap.org/data/2.5/air_pollution?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${apiKey}`
        );
        var air_pollution_data = await airpolution_response.json();

        pmData.textContent = air_pollution_data["list"][0].components.pm2_5;
        soData.textContent = air_pollution_data["list"][0].components.so2;
        noData.textContent = air_pollution_data["list"][0].components.no2;
        oData.textContent = air_pollution_data["list"][0].components.o3;
    }
}

// get_date
function get_date(timestamp) {
    var date = new Date(timestamp * 1000);
    return date;
}

function formatTime(time) {
    var hour = time.getHours();
    var minutes = time.getMinutes();
    return ("0" + hour).slice(-2) + ":" + ("0" + minutes).slice(-2);
}

function formatDate(initialDate) {
    var originalDate = new Date(initialDate);

    var date = originalDate.getDate();
    var day = originalDate.toLocaleDateString("en-US", { weekday: "long" });
    var month = originalDate.toLocaleDateString("en-Us", { month: "short" });

    return { date, day, month };
}

async function getHourlyForcast(city) {
    var api_url =
        "https://api.openweathermap.org/data/2.5/forecast?&units=metric&q=";

    var hourlyResponse = await fetch(api_url + city + `&appid=${apiKey}`);
    var hourlyData = await hourlyResponse.json();

    for (let i = 0; i < 8; i++) {
        const elementData = hourlyData["list"][i];

        weather_widget_icon[
            i
        ].src = `./Assets/images/${elementData.weather[0].icon}.png`;

        widgetTemperature[i].textContent = `${Math.round(
            elementData.main.temp
        )}°`;
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("GeoLocation not supported by this browser.");
    }
}

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // reverse Geocode
    reverseGeocode(latitude, longitude);
}

function reverseGeocode(latitude, longitude) {
    const apiURL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=5&appid=${apiKey}`;

    fetch(apiURL)
        .then((response) => response.json())
        .then((data) => getWeatherData(data[0].name))
        .catch((error) => {
            console.log(error);
        });
}

// City Input Value
var city = document.querySelector(".search-bar input");
submitBtn.addEventListener("click", () => {
    getWeatherData(city.value);
});

locationBtn.addEventListener("click", getLocation);
