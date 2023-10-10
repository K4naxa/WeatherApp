const locationSearchBar = document.getElementById("locationSearchBar");
const celsiusButton = document.querySelector(".celsiusButton");
const farenheitBtn = document.querySelector(".farenheitBtn");

const DOMMainContainer = document.getElementById("mainContainer");

// Class to manage all DOM rendering
class RenderManagment {
  renderLocationData() {
    const weather = weatherManager.Weather;
    console.log(weather);

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

  // Render all weather information
  async renderWeatherData() {
    DOMMainContainer.innerHTML = "";
    this.renderLocationData();
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
      UV: Infinity,
      vis_km: Infinity,
      vis_miles: Infinity,
      wind_kph: Infinity,
      wind_mph: Infinity,
      humidity: Infinity,
      lastUpdated: "",
    };
  }

  // Forwards the inputted search location to renderWeatherData function and cleans the searchbar
  weatherSearchActivation(e) {
    if (e.key === "Enter") {
      const value = e.target.value;
      e.target.value = "";
      this.updateWeatherData(value);
      renderManager.renderWeatherData();
    }
  }

  async updateWeatherData(searchLocation) {
    const weatherData = await this.fetchWeatherData(searchLocation);
    console.log(weatherData.current.temp_c);

    this.Weather.location = weatherData.location.name;
    this.Weather.country = weatherData.location.country;

    this.Weather.temp_c = weatherData.current.temp_c;
    this.Weather.temp_f = weatherData.current.temp_f;
    this.Weather.feelsLike_c = weatherData.current.feelslike_c;
    this.Weather.feelsLike_f = weatherData.current.feelslike_f;

    this.Weather.conditionText = weatherData.current.condition.text;
    this.Weather.conditionIcon = weatherData.current.condition.icon;

    this.Weather.UV = weatherData.current.uv;

    this.Weather.vis_km = weatherData.current.vis_km;
    this.Weather.vis_miles = weatherData.current.vis_miles;

    this.Weather.wind_kph = weatherData.current.wind_kph;
    this.Weather.wind_mph = weatherData.current.wind_mph;

    this.Weather.humidity = weatherData.current.humidity;

    this.Weather.lastUpdated = weatherData.current.last_updated;
  }

  // Gets the weather data from the API and returns it
  async fetchWeatherData(input) {
    let solution = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=7d6ccec9f9824320846142016230910&q=${input}&aqi=no`,
      { mode: "cors" }
    );
    const weatherData = solution.json();
    return weatherData;
  }
}
const weatherManager = new WeatherManagment();

// Searchbar Enter Eventlistener
locationSearchBar.addEventListener("keypress", (e) => {
  weatherManager.weatherSearchActivation(e);
});
