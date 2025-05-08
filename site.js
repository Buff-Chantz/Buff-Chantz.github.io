const API_KEY = "80ef7462ec878665c2c4227caecac0d3";

async function calculateTime() {
  const location = document.getElementById("locationInput").value.trim();
  const useCelsius = document.getElementById("celsiusToggle").checked;
  const resultElement = document.getElementById("result");

  if (!location) {
    resultElement.textContent = "Please enter a location.";
    return;
  }

  resultElement.textContent = "Calculating...";

  try {
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${API_KEY}`
    );

    if (!geoRes.ok) throw new Error("Geocoding failed.");

    const geoData = await geoRes.json();

    if (!geoData.length) throw new Error("Location not found.");

    const { lat, lon } = geoData[0];
    const units = useCelsius ? "metric" : "imperial";

    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
    );

    if (!weatherRes.ok) throw new Error("Weather fetch failed.");

    const weatherData = await weatherRes.json();
    const outdoorTemp = weatherData.main.temp;

    const initialTemp = useCelsius ? 22.2 : 72; // room temp
    const finalTemp = useCelsius ? 7.2 : 45;    // chill temp
    const k = 0.03;

    const numerator = initialTemp - outdoorTemp;
    const denominator = finalTemp - outdoorTemp;
    
if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
  resultElement.textContent = "Unable to calculate — check the temperature data.";
} else if (outdoorTemp >= initialTemp) {
  resultElement.textContent = "It's too warm outside to chill your beer effectively.";
} else {
  const time = Math.max((1 / k) * Math.log(numerator / denominator), 0);
  resultElement.textContent = `Leave your beer outside for about ${Math.round(time)} minutes to reach the perfect drinking temperature. 🍺`;
}

    }

  } catch (error) {
    console.error(error);
    resultElement.textContent = "Error retrieving data. Please try a different location.";
  }
}


