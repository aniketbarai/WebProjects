const apiKey = "b3092597fac433d7181223d15a96a691";
const base_URL =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".whetherIcon");

async function checkWeather(city) {
  const response = await fetch(base_URL + city + `&appid=${apiKey}`);

  if (response.status == 404) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".whether").style.display = "none";
  } else {
    document.querySelector(".error").style.display = "none";
    var data = await response.json();
    console.log(data);
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML =
      Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";

    if (data.weather[0].main === "Clouds") {
      weatherIcon.src = "Images/cloud.png";
    } else if (data.weather[0].main === "Clear") {
      weatherIcon.src = "Images/clear.png";
    } else if (data.weather[0].main === "Rain") {
      weatherIcon.src = "Images/rain.png";
    } else if (data.weather[0].main === "Drizzle") {
      weatherIcon.src = "Images/drizzle.png";
    } else if (data.weather[0].main === "Mist") {
      weatherIcon.src = "Images/mist.png";
    }
    document.querySelector(".whether").style.display = "block";
  }
}
searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});
