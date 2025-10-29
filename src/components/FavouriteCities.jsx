import { Droplets, Heart, Wind, X } from "lucide-react";
import { getGradient, getWeatherDescription, getWeatherEmoji } from "./utils";

export default function FavouriteCities() {
  const [favourites, setFavorites] = useState([]);
    const removeFromFavorites = (index) => {
    const newFavorites = favorites.filter((_, i) => i !== index);
    saveFavorites(newFavorites);
  };
    const isFavorite = (lat, lon) => {
    return favorites.some((fav) => fav.lat === lat && fav.lon === lon);
  };
  
  const addToFavorites = async (city) => {
    const isDuplicate = favorites.some(
      (fav) => fav.lat === city.latitude && fav.lon === city.longitude
    );

    if (isDuplicate) {
      setSearchQuery("");
      setSearchResults([]);
      setShowSearch(false);
      return;
    }

    const weather = await fetchWeather(
      city.latitude,
      city.longitude,
      `${city.name}, ${city.country}`
    );
    if (weather) {
      const newFavorites = [...favorites, weather];
      saveFavorites(newFavorites);
      setSearchQuery("");
      setSearchResults([]);
      setShowSearch(false);
    }
  };
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Heart className="w-5 h-5 text-red-400" />
        <h3 className="text-2xl font-bold">Favorite Cities</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((fav, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-200 group relative"
          >
            <button
              onClick={() => removeFromFavorites(idx)}
              className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-red-500 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold mb-1">{fav.name}</h4>
                <p className="text-slate-400 text-sm">
                  {getWeatherDescription(fav.weatherCode)}
                </p>
              </div>
              <span className="text-4xl">
                {getWeatherEmoji(fav.weatherCode)}
              </span>
            </div>

            <div className="flex items-end gap-1 mb-4">
              <span className="text-5xl font-bold">{fav.temperature}°</span>
              <span className="text-xl text-slate-400 mb-2">C</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <Wind className="w-4 h-4" />
                <span>{fav.windSpeed} km/h</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Droplets className="w-4 h-4" />
                <span>{fav.humidity}%</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 text-sm text-slate-400">
              H: {fav.maxTemp}° • L: {fav.minTemp}°
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
