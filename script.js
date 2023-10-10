const locationSearchBar = document.getElementById("locationSearchBar");
const celsiusButton = document.querySelector(".celsiusButton");
const farenheitBtn = document.querySelector(".farenheitBtn");

const DOMMainContainer = document.getElementById("mainContainer");

// Class to manage all DOM rendering
class RenderManagment {
  renderLocationData() {
    const weatherData = weatherManager.weatherData;

    const locationInfoContainer = document.createElement("div");
    const locationText = document.createElement("h3");
    const informationUpdateTime = document.createElement("span");

    locationText.innerText = weatherData.location + ", " + weatherData.country;
    informationUpdateTime.innerText = weatherData.lastUpdated;

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
    this.weatherData = await this.fetchWeatherData(searchLocation);
    const weatherData = this.weatherData;

    const location = weatherData.location.name;
    const country = weatherData.location.country;

    const temp_c = weatherData.current.temp_c;
    const temp_f = weatherData.current.temp_f;
    const feelsLike_c = weatherData.current.feelslike_c;
    const feelsLike_f = weatherData.current.feelslike_f;

    const conditionText = weatherData.current.condition.text;
    const conditionIcon = weatherData.current.condition.icon;

    const UV = weatherData.current.uv;

    const vis_km = weatherData.current.vis_km;
    const vis_miles = weatherData.current.vis_miles;

    const wind_kph = weatherData.current.wind_kph;
    const wind_mph = weatherData.current.wind_mph;

    const humidity = weatherData.current.humidity;

    const lastUpdated = weatherData.current.last_updated;

    this.weatherData = [
      location,
      country,
      temp_c,
      temp_f,
      feelsLike_c,
      feelsLike_f,
      conditionText,
      conditionIcon,
      UV,
      vis_km,
      vis_miles,
      wind_kph,
      wind_mph,
      humidity,
      lastUpdated,
    ];
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
