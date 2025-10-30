import { Droplets, Heart, Wind, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getWeatherDescription, getWeatherEmoji, fetchWeather } from "./utils";

export default function FavouriteCities({
  favorites,
  removeFromFavorites,
  onClick,
}) {
  return (
    <div className="mt-10">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="w-5 h-5 text-red-400" />
        <h3 className="text-2xl font-bold">Favorite Cities</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {favorites.map((fav, idx) => (
          <FavoriteCityWeatherCard
            lat={fav.lat}
            log={fav.log}
            name={fav.name}
            key={idx}
            onClick={onClick}
          />
        ))}
        {favorites.length === 0 && (
          <div className="flex justify-center w-full">
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🌍</div>
              <h3 className="text-2xl font-semibold mb-2 text-slate-300">
                No Favorite Cities Yet
              </h3>
              <p className="text-slate-400 mb-6">
                Add cities to quickly check their weather
              </p>
              <button
                onClick={() => setShowSearch(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition-all duration-200 font-medium"
              >
                Add Your First City
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const FavoriteCityWeatherCard = ({
  lat,
  log,
  name,
  onClick,
}) => {
  const [weatherData, setWeather] = useState({});
  const fetchWeatherData = async () => {
    const wData = await fetchWeather(lat, log, name);
    setWeather(wData);
  };
  useEffect(() => {
    fetchWeatherData();
  }, []);
  return (
    <div
      onClick={() => onClick({ lat, lon:log, name })}
      className="hover:cursor-pointer bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-200 group relative"
    >

      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-lg font-semibold mb-1 capitalize">
            {weatherData.name}
          </h4>
          <p className="text-slate-400 text-sm">
            {getWeatherDescription(weatherData.weatherCode)}
          </p>
        </div>
        <span className="text-4xl">
          {getWeatherEmoji(weatherData.weatherCode)}
        </span>
      </div>

      <div className="flex items-end gap-1 mb-4">
        <span className="text-5xl font-bold">{weatherData.temperature}°</span>
        <span className="text-xl text-slate-400 mb-2">C</span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-slate-400">
          <Wind className="w-4 h-4" />
          <span>{weatherData.windSpeed} km/h</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Droplets className="w-4 h-4" />
          <span>{weatherData.humidity}%</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800 text-sm text-slate-400">
        H: {weatherData.maxTemp}° • L: {weatherData.minTemp}°
      </div>
    </div>
  );
};
