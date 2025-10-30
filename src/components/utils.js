export const getWeatherDescription = (code) => {
  if (code === 0) return "Clear";
  if (code <= 3) return "Partly Cloudy";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  return "Cloudy";
};

export const getWeatherEmoji = (code) => {
  if (code === 0) return "☀️";
  if (code <= 3) return "⛅";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "❄️";
  return "☁️";
};

export const getGradient = (code) => {
    if (code === 0) return "from-amber-400 to-orange-500";
    if (code <= 3) return "from-blue-400 to-blue-600";
    if (code <= 67) return "from-slate-600 to-slate-800";
    return "from-gray-400 to-gray-600";
  };

export const fetchWeather = async (lat, lon, name) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,pressure_msl,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
      );
      const data = await response.json();

      const weatherData = {
        name,
        lat,
        lon,
        temperature: Math.round(data.current?.temperature_2m),
        feelsLike: Math.round(data.current?.apparent_temperature),
        humidity: data.current?.relative_humidity_2m,
        windSpeed: Math.round(data?.current?.wind_speed_10m),
        precipitation: data?.current?.precipitation,
        weatherCode: data?.current?.weather_code,
        pressure: Math.round(data?.current?.pressure_msl),
        visibility: Math.round(data?.current?.visibility / 1000),
        maxTemp: Math.round(data.daily?.temperature_2m_max[0]),
        minTemp: Math.round(data.daily?.temperature_2m_min[0]),
      };

      return weatherData;
    } catch (err) {
      console.error("Error fetching weather:", err);
      return null;
    }
  };

export const POPULAR_CITIES = [
  { name: "Mumbai", lat: "18.9582", log: "72.8321" },
  { name: "London", lat: "51.5074", log: "-0.1278" },
  { name: "Tokyo", lat: "35.6895", log: "139.6917" },
  { name: "Paris", lat: "48.8566", log: "2.3522" },
];