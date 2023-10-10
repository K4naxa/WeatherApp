const locationSearchBar = document.getElementById("locationSearchBar");
const celsiusButton = document.querySelector(".celsiusButton");
const farenheitBtn = document.querySelector(".farenheitBtn");

// Class to manage all DOM rendering
class RenderManagment {
  async renderWeatherData(searchLocation) {
    const weatherData = await weatherManager.getWeatherData(searchLocation);
    console.log(weatherData);
  }
}
const renderManager = new RenderManagment();

// Class that manages all of the weather functions
class WeatherManagment {
  // Forwards the inputted search location to renderWeatherData function and cleans the searchbar
  weatherSearchActivation(e) {
    if (e.key === "Enter") {
      const value = e.target.value;
      e.target.value = "";
      renderManager.renderWeatherData(value);
    }
  }

  async getWeatherData(searchLocation) {
    const weatherData = await this.fetchWeatherData(searchLocation);
    const location = weatherData.location.name;
    const country = weatherData.location.country;

    const temp_c = weatherData.current.condition.temp_c;
    const temp_f = weatherData.current.condition.temp_f;
    const feelsLike_c = weatherData.current.feelslike_c;
    const feelsLike_f = weatherData.current.feelslike_f;

    const conditionText = weatherData.current.condition.text;
    const conditionIcon = weatherData.current.condition.icon;

    const UV = weatherData.current.condition.uv;

    const vis_km = weatherData.current.condition.vis_km;
    const vis_miles = weatherData.current.condition.vis_miles;

    const wind_kph = weatherData.current.condition.wind_kph;
    const wind_mph = weatherData.current.condition.wind_mph;

    const humidity = weatherData.current.condition.humidity;

    const lastUpdated = weatherData.current.condition.last_updated;

    console.log(weatherData);
    return [location, country, conditionText, conditionIcon];
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
