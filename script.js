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
  renderHourlyWeather() {
    const hourlyWeather =
      weatherManager.weatherData.forecast.forecastday[0].hour;

    // Create carouselContainer
    const hourlyCarouselContainer = document.createElement("div");
    hourlyCarouselContainer.classList.add("hourlyCarouselContainer");
    DOMMainContainer.appendChild(hourlyCarouselContainer);

    // Create title for the carousel
    const carouselTitle = document.createElement("span");
    carouselTitle.classList.add("carouselTitle");
    carouselTitle.innerText = "Hourly";
    hourlyCarouselContainer.appendChild(carouselTitle);

    // Create the carousel that contains the hourly cards
    const hourlyCarousel = document.createElement("div");
    hourlyCarousel.classList.add("hourlyCarousel");
    hourlyCarouselContainer.appendChild(hourlyCarousel);

    hourlyWeather.forEach((hour) => {
      // Create the card container
      const hourlyDetailsCard = document.createElement("div");
      hourlyDetailsCard.classList.add("hourlyDetailsCard");
      hourlyCarousel.appendChild(hourlyDetailsCard);

      // create card title (time)
      const title = document.createElement("div");
      title.classList.add("title");
      title.innerText = new Date(hour.time).getHours() + ":00";
      hourlyDetailsCard.appendChild(title);

      // Check if this card is for the current hour
      if (new Date().getHours() === new Date(hour.time).getHours()) {
        hourlyDetailsCard.scrollIntoView({
          inline: "end",
          block: "start",
          behavior: "smooth",
        });
      }

      // create temperature div that includes weather icon and temp
      const temperature = document.createElement("div");
      temperature.classList.add("temperature");
      hourlyDetailsCard.appendChild(temperature);

      const detailsIcon = document.createElement("img");
      detailsIcon.classList.add("detailsIcon");
      detailsIcon.src = hour.condition.icon;
      temperature.appendChild(detailsIcon);

      const temperatureText = document.createElement("span");
      temperatureText.classList.add("temperatureText");

      // input metrics to temp and wind depending on settings to show Celsius or Fahrenheit
      if (this.showInCelsius === true) {
        temperatureText.innerText = hour.temp_c + "°C";
      } else {
        temperatureText.innerText = hour.temp_f + "°F";
      }

      temperature.appendChild(temperatureText);

      // create container for weather details (wind, chance for rain)
      const details = document.createElement("div");
      details.classList.add("details");
      hourlyDetailsCard.appendChild(details);

      // create container for wind details (icon, text)
      const wind = document.createElement("div");
      wind.classList.add("wind");
      details.appendChild(wind);

      const windIcon = document.createElement("img");
      windIcon.src = "/Icons/wind white.svg";
      wind.appendChild(windIcon);

      const windValue = document.createElement("span");
      if (this.showInCelsius) {
        windValue.innerText = hour.wind_kph;
      } else {
        windValue.innerText = hour.wind_mph;
      }

      const windUnit = document.createElement("span");
      windUnit.innerText = this.showInCelsius ? " kph" : " mph";
      windUnit.classList.add("windUnitText");

      wind.appendChild(windValue);
      wind.appendChild(windUnit);

      // create container for rain/snow chance details (icon, text)
      const rain = document.createElement("div");
      rain.classList.add("rain");
      details.appendChild(rain);

      const rainIcon = document.createElement("img");

      if (
        hour.chance_of_rain > hour.chance_of_snow ||
        hour.chance_of_snow === 0
      ) {
        rainIcon.src = "/Icons/cloud-rain.svg";
        rain.appendChild(rainIcon);

        const rainText = document.createElement("span");
        rainText.innerText = hour.chance_of_rain + "%";
        rain.appendChild(rainText);
      } else {
        rainIcon.src = "/Icons/cloud-snow.svg";
        rain.appendChild(rainIcon);

        const rainText = document.createElement("span");
        rainText.innerText = hour.chance_of_snow + "%";
        rain.appendChild(rainText);
      }
    });
  }
  renderDailyForecast() {
    const dailyForecast = weatherManager.weatherData.forecast.forecastday;

    // Weekdays for the dayTxt info
    const weekday = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    //Create container for dailyforecasts
    const dailyContainer = document.createElement("div");
    dailyContainer.classList.add("dailyContainer");
    DOMMainContainer.appendChild(dailyContainer);

    //Create title for the dailyforectsts container
    const dailyContainerTitle = document.createElement("div");
    dailyContainerTitle.classList.add("title");
    dailyContainerTitle.innerText = "Daily";
    dailyContainer.appendChild(dailyContainerTitle);

    // Loop through the daily forecasts from api and create a card each of them
    dailyForecast.forEach((day) => {
      // card that includes the forecast information
      const dailyCard = document.createElement("div");
      dailyCard.classList.add("dailyForecast");
      dailyContainer.appendChild(dailyCard);

      //Container for Date info (text, numeral)
      const date = document.createElement("div");
      date.classList.add("date");
      dailyCard.appendChild(date);

      // date text
      const dateText = document.createElement("div");
      dateText.classList.add("dateText");
      dateText.innerText = weekday[new Date(day.date).getDay()];
      date.appendChild(dateText);

      // date numeral
      const dateNumbers = document.createElement("div");
      dateNumbers.classList.add("dateNumbers");
      dateNumbers.innerText = day.date;
      date.appendChild(dateNumbers);

      //condition icon
      const conditionIcon = document.createElement("div");
      conditionIcon.classList.add("conditionIcon");
      dailyCard.appendChild(conditionIcon);

      const conditionIconImage = document.createElement("img");
      conditionIconImage.src = day.day.condition.icon;
      conditionIcon.appendChild(conditionIconImage);

      // container for tempereature icon and numeral value
      const temperature = document.createElement("div");
      temperature.classList.add("temperature");
      dailyCard.appendChild(temperature);

      const temperatureIcon = document.createElement("img");
      temperatureIcon.src = "/Icons/thermometer.svg";
      temperature.appendChild(temperatureIcon);

      // container for max and min temperatures
      const temperatureValues = document.createElement("div");
      temperatureValues.classList.add("temperatureValues");
      temperature.appendChild(temperatureValues);

      // max temp value
      const maxTemperature = document.createElement("span");
      maxTemperature.classList.add("maxTemperature");

      if (this.showInCelsius) {
        maxTemperature.innerText = day.day.maxtemp_c + "°C";
      } else {
        maxTemperature.innerText = day.day.maxtemp_f + "°F";
      }
      temperatureValues.appendChild(maxTemperature);

      // min temp value
      const minTemperature = document.createElement("span");
      minTemperature.classList.add("minTemperature");

      if (this.showInCelsius) {
        minTemperature.innerText = day.day.mintemp_c + "°C";
      } else {
        minTemperature.innerText = day.day.mintemp_f + "°F";
      }
      temperatureValues.appendChild(minTemperature);

      // container for chace of rain icon and value
      const chanceOfRain = document.createElement("div");
      chanceOfRain.classList.add("chaceOfRain");
      dailyCard.appendChild(chanceOfRain);

      // deciding if showing chance for rain or for snow
      if (
        day.day.daily_chance_of_rain > day.day.daily_chance_of_snow ||
        day.day.daily_chance_of_snow === 0
      ) {
        const chanceOfRainIcon = document.createElement("img");
        chanceOfRainIcon.src = "/Icons/cloud-rain.svg";
        chanceOfRain.appendChild(chanceOfRainIcon);

        const chanceOfRainValue = document.createElement("span");
        chanceOfRainValue.innerText = day.day.daily_chance_of_rain;
        chanceOfRain.appendChild(chanceOfRainValue);
      } else {
        const chanceOfRainIcon = document.createElement("img");
        chanceOfRainIcon.src = "/Icons/cloud-snow.svg";
        chanceOfRain.appendChild(chanceOfRainIcon);

        const chanceOfRainValue = document.createElement("span");
        chanceOfRainValue.innerText = day.day.daily_chance_of_snow;
        chanceOfRain.appendChild(chanceOfRainValue);
      }

      // container for sunrise icon and value
      const sunrise = document.createElement("div");
      sunrise.classList.add("sunrise");
      dailyCard.appendChild(sunrise);
      // sunsrise icon
      const sunriseIcon = document.createElement("img");
      sunriseIcon.classList.add("sunriseIcon");
      sunriseIcon.src = "/Icons/sunrise.svg";
      sunrise.appendChild(sunriseIcon);
      //sunrise value
      const sunriseTime = document.createElement("span");
      sunriseTime.classList.add("sunriseTime");
      sunriseTime.innerText = day.astro.sunrise;
      sunrise.appendChild(sunriseTime);

      // container for sunset icon and value
      const sunset = document.createElement("div");
      sunset.classList.add("sunset");
      dailyCard.appendChild(sunset);
      // sunset icon
      const sunsetIcon = document.createElement("img");
      sunsetIcon.classList.add("sunsetIcon");
      sunsetIcon.src = "/Icons/sunset.svg";
      sunset.appendChild(sunsetIcon);
      // sunset time
      const sunsetTime = document.createElement("span");
      sunsetTime.classList.add("sunsetTime");
      sunsetTime.innerText = day.astro.sunset;
      sunset.appendChild(sunsetTime);
    });
  }

  // Render all weather information
  async renderWeatherData() {
    DOMMainContainer.innerHTML = "";
    this.renderLocationData();
    this.renderWeatherInfo();
    this.renderWeatherDetails();
    this.renderHourlyWeather();
    this.renderDailyForecast();
  }
}
const renderManager = new RenderManagment();

// Class that manages all of the weather functions
class WeatherManagment {
  constructor() {
    this.weatherData = {};

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
    this.weatherData = await this.fetchWeatherData(searchLocation);

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
      `http://api.weatherapi.com/v1/forecast.json?key=7d6ccec9f9824320846142016230910&q=${input}&days=3&aqi=no&alerts=no`,
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
