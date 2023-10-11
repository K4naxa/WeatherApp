const locationSearchBar = document.getElementById("locationSearchBar");
const celsiusButton = document.querySelector(".celsiusButton");
const farenheitBtn = document.querySelector(".farenheitBtn");

const DOMMainContainer = document.getElementById("mainContainer");

// Class to manage all DOM rendering
class RenderManagment {
  constructor() {
    this.showInCelsius = true;
  }
  renderLocationData() {
    const weather = weatherManager.Weather;

    const locationInfoContainer = document.createElement("div");
    const locationText = document.createElement("h3");
    const informationUpdateTime = document.createElement("span");

    locationText.innerText = weather.location + ", " + weather.country;
    informationUpdateTime.innerText = weather.lastUpdated;

    locationInfoContainer.classList.add("searchInfoContainer");
    locationText.classList.add("weatherLocation");
    informationUpdateTime.classList.add("weatherTimingInfo");

    DOMMainContainer.appendChild(locationInfoContainer);
    locationInfoContainer.appendChild(locationText);
    locationInfoContainer.appendChild(informationUpdateTime);
  }
  renderWeatherDetails() {
    let weatherDetails;

    // Checks wether we show in celcius or farenheit
    if (this.showInCelsius === true) {
      weatherDetails = weatherManager.weatherDetailsCelsius;
    } else {
      weatherDetails = weatherManager.weatherDetailsFarenheit;
    }

    const weatherDetailsGrid = document.createElement("div");
    weatherDetailsGrid.classList.add("weatherDetails");
    DOMMainContainer.appendChild(weatherDetailsGrid);

    // iterates through every value in weatherDetails and creates a div for it
    for (const [key, value] of Object.entries(weatherDetails)) {
      const detailsDiv = document.createElement("div");
      detailsDiv.classList.add("details");

      const detailsTitle = document.createElement("div");
      detailsTitle.classList.add("detailsTitle");
      detailsTitle.innerText = key;

      const detailsData = document.createElement("div");
      detailsData.classList.add("detailsData");
      detailsData.innerText = value;

      weatherDetailsGrid.appendChild(detailsDiv);
      detailsDiv.appendChild(detailsTitle);
      detailsDiv.appendChild(detailsData);
    }
  }
  renderWeatherInfo() {
    const weather = weatherManager.Weather;

    const weatherInfoContainer = document.createElement("div");
    const temperatureWindow = document.createElement("div");
    const lowerTemperatureWindow = document.createElement("div");
    const conditionText = document.createElement("span");
    const feelsLikeText = document.createElement("span");
    const temperatureWindowImg = document.createElement("img");
    const temperatureWindowTemp = document.createElement("h1");

    weatherInfoContainer.classList.add("weatherInfoContainer");
    temperatureWindow.classList.add("temperatureWindow");
    lowerTemperatureWindow.classList.add("lowerTemperatureWindow");
    conditionText.classList.add("conditionText");
    feelsLikeText.classList.add("feelsLikeText");

    DOMMainContainer.appendChild(weatherInfoContainer);
    weatherInfoContainer.appendChild(temperatureWindow);
    temperatureWindow.appendChild(temperatureWindowImg);
    temperatureWindow.appendChild(temperatureWindowTemp);
    weatherInfoContainer.appendChild(lowerTemperatureWindow);
    lowerTemperatureWindow.appendChild(conditionText);
    lowerTemperatureWindow.appendChild(feelsLikeText);

    // Decide wether to show in Celcius or Farenheit
    if (this.showInCelsius === true) {
      temperatureWindowTemp.innerText = weather.temp_c + "°C";
      feelsLikeText.innerText = "Feels like " + weather.feelsLike_c + "°C";
    } else {
      temperatureWindowTemp.innerText = weather.temp_f + "°F";
      feelsLikeText.innerText = "Feels like " + weather.feelsLike_f + "°F";
    }

    temperatureWindowImg.src = weather.conditionIcon;
    conditionText.innerText = weather.conditionText;
  }

  // Render all weather information
  async renderWeatherData() {
    // DOMMainContainer.innerHTML = "";
    this.renderLocationData();
    this.renderWeatherInfo();
    this.renderWeatherDetails();
  }
}
const renderManager = new RenderManagment();

// Class that manages all of the weather functions
class WeatherManagment {
  constructor() {
    this.weatherData = this.updateWeatherData("helsinki");
    this.Weather = {
      location: "",
      country: "",
      temp_c: 0,
      temp_f: Infinity,
      feelsLike_c: Infinity,
      feelsLike_f: Infinity,
      conditionText: "",
      conditionIcon: "",
      lastUpdated: "",
    };
    this.weatherDetailsCelsius = {
      wind_kph: Infinity,
      vis_km: Infinity,
      humidity: Infinity,
      UV: Infinity,
    };
    this.weatherDetailsFarenheit = {
      wind_mph: Infinity,
      vis_miles: Infinity,
      humidity: Infinity,
      UV: Infinity,
    };
  }

  // Forwards the inputted search location to renderWeatherData function and cleans the searchbar
  async weatherSearchActivation(searchLocation) {
    await this.updateWeatherData(searchLocation);
    await renderManager.renderWeatherData();
  }

  async updateWeatherData(searchLocation) {
    const weatherData = await this.fetchWeatherData(searchLocation);

    this.Weather.location = weatherData.location.name;
    this.Weather.country = weatherData.location.country;

    this.Weather.temp_c = weatherData.current.temp_c;
    this.Weather.temp_f = weatherData.current.temp_f;
    this.Weather.feelsLike_c = weatherData.current.feelslike_c;
    this.Weather.feelsLike_f = weatherData.current.feelslike_f;

    this.Weather.conditionText = weatherData.current.condition.text;
    this.Weather.conditionIcon = weatherData.current.condition.icon;

    this.weatherDetailsFarenheit.UV = weatherData.current.uv;
    this.weatherDetailsCelsius.UV = weatherData.current.uv;

    this.weatherDetailsCelsius.vis_km = weatherData.current.vis_km;
    this.weatherDetailsFarenheit.vis_miles = weatherData.current.vis_miles;

    this.weatherDetailsCelsius.wind_kph = weatherData.current.wind_kph;
    this.weatherDetailsFarenheit.wind_mph = weatherData.current.wind_mph;

    this.weatherDetailsFarenheit.humidity = weatherData.current.humidity;
    this.weatherDetailsCelsius.humidity = weatherData.current.humidity;

    this.Weather.lastUpdated = weatherData.current.last_updated;
  }

  // Gets the weather data from the API and returns it
  async fetchWeatherData(input) {
    let solution = await fetch(
      //   `http://api.weatherapi.com/v1/current.json?key=7d6ccec9f9824320846142016230910&q=${input}&aqi=no`,
      `http://api.weatherapi.com/v1/forecast.json?key=7d6ccec9f9824320846142016230910&q=${input}&days=7&aqi=no&alerts=no`,
      { mode: "cors" }
    ).catch((message) => {
      console.error(message);
    });
    const weatherData = await solution.json();
    return weatherData;
  }
}
const weatherManager = new WeatherManagment();

// Searchbar Enter Eventlistener
locationSearchBar.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    weatherManager.weatherSearchActivation(e.target.value);
    e.target.value = "";
  }
});

// RUN ON STARTUP
weatherManager.weatherSearchActivation("Helsinki");
