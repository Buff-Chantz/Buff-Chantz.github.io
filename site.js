const API_KEY = "80ef7462ec878665c2c4227caecac0d3";

async function calculateTime() {
  const location = document.getElementById("locationInput").value.trim();
  const useCelsius = document.getElementById("celsiusToggle").checked;
  const resultElement = document.getElementById("result");

  resultElement.textContent = "Calculating...";

  try {
    // Fetch location coordinates
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${API_KEY}`
    );
    const geoData = await geoRes.json();
    console.log("Geolocation result:", geoData);

    if (!geoData.length) throw new Error("Location not found.");

    const { lat, lon } = geoData[0];
    const units = useCelsius ? "metric" : "imperial";

    // Fetch weather data
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
    );
    const weatherData = await weatherRes.json();
    console.log("Weather data response:", weatherData);

    const outdoorTemp = weatherData.main.temp;
    console.log("Outdoor Temp:", outdoorTemp);

    // Set beer chilling values
    const initialTemp = useCelsius ? 22.2 : 72; // room temp
    const finalTemp = useCelsius ? 7.2 : 45;     // ideal beer temp
    const k = 0.03;

    const tempDiffNumerator = initialTemp - outdoorTemp;
    const tempDiffDenominator = finalTemp - outdoorTemp;

    console.log("Numerator:", tempDiffNumerator);
    console.log("Denominator:", tempDiffDenominator);

    if (tempDiffNumerator <= 0 || tempDiffDenominator <= 0) {
      resultElement.textContent = "It's too warm outside to chill your beer effectively.";
      return;
    }

    let time = (1 / k) * Math.log(tempDiffNumerator / tempDiffDenominator);
    time = Math.max(time, 0);

    if (!isFinite(time)) {
      resultElement.textContent = "It's too warm outside to chill your beer effectively.";
    } else {
      resultElement.textContent = `Leave your beer outside for about ${Math.round(time)} minutes.`;
    }
  } catch (error) {
    console.error("Error:", error);
    resultElement.textContent = "Error retrieving data. Please try a different location.";
  }
}

