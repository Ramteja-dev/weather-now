import { Droplets, Heart, Wind, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getWeatherDescription, getWeatherEmoji, fetchWeather, POPULAR_CITIES } from "./utils";

export default function PopularCities({ favorites, removeFromFavorites }) {
    console.log(POPULAR_CITIES)
  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="w-5 h-5 text-red-400" />
        <h3 className="text-2xl font-bold">Popular Cities</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 w-full">
        {POPULAR_CITIES.map((fav, idx) => (
          <PopularCityWeatherCard
            lat={fav.lat}
            lon={fav.log}
            name={fav.name}
            key={idx}
            removeFromFavorites={() => removeFromFavorites(idx)}
          />
        ))}
      </div>
    </div>
  );
}

const PopularCityWeatherCard = ({ lat, lon, name, removeFromFavorites }) => {
  const [weatherData, setWeather] = useState({});

  const fetchWeatherData = async () => {
    const wData = await fetchWeather(lat, lon, name);
    setWeather(wData);
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  return (
    <div className="relative flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4 w-full h-24 hover:border-slate-700 transition-all duration-200 group">
      {/* Remove Button */}
      <button
        onClick={removeFromFavorites}
        className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-red-500 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* City Name & Emoji */}
      <div className="flex items-center text-center mb-3 gap-3">
        <span className="text-3xl mb-1">{getWeatherEmoji(weatherData.weatherCode)}</span>
        <h4 className="text-base font-semibold capitalize">{weatherData.name || name}</h4>
        <p className="text-slate-400 text-xs">{getWeatherDescription(weatherData.weatherCode)}</p>
      </div>

      {/* Temperature */}
      <div className="flex items-center mb-3">
        <span className="text-4xl font-bold">{weatherData.temperature}°</span>
        <span className="text-4xl font-bold">C</span>
      </div>

      {/* Additional Info */}
      <div className="flex flex-col gap-2 text-slate-400 text-xs items-center">
        <div className="flex items-center gap-1.5">
          <Wind className="w-3.5 h-3.5" />
          <span>{weatherData.windSpeed} km/h</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Droplets className="w-3.5 h-3.5" />
          <span>{weatherData.humidity}%</span>
        </div>
        {/* <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5">H</span>
          <span>{weatherData.maxTemp}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5">L</span>
          <span>{weatherData.minTemp}%</span>
        </div> */}
      </div>

      {/* High/Low */}
    </div>
  );
};
