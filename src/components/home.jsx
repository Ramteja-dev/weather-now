import {
  Loader2,
  Search
} from "lucide-react";
import { useEffect, useState } from "react";
import FavouriteCities from "./FavouriteCities";
import SearchCities from "./SearchCities";
import WeatherCard from "./WeatherCard";
import PopularCities from "./PopularCities";

const WeatherApp = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    loadFavorites();
    getCurrentLocationWeather();
  }, []);

  const loadFavorites = () => {
    const saved = localStorage.getItem("weatherFavorites");
    if (saved) {
      const favs = JSON.parse(saved);
      favs.forEach((fav, idx) => {
        // fetchWeather(fav.lat, fav.log, fav.name).then((updated) => {
          
        //   setFavorites((prev) => {
        //     const newFavs = [...prev];
        //     newFavs[idx] = updated;
        //     return newFavs;
        //   });
        // });
        setFavorites((prev) => {
            const newFavs = [...prev];
            newFavs[idx] = { lat: fav.lat, log:fav.log, name:fav.name};
            return newFavs;
          });
      });
    }
  };

  const saveFavorites = (favs) => {
    localStorage.setItem("weatherFavorites", JSON.stringify(favs));
    setFavorites(favs);
  };

  const getCurrentLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await fetchWeather(latitude, longitude, "Current Location", true);
          setLoading(false);
        },
        () => {
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  };

  const fetchWeather = async (lat, lon, name, isCurrent = false) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,pressure_msl,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
      );
      const data = await response.json();

      const weatherData = {
        name,
        lat,
        lon,
        temperature: Math.round(data?.current?.temperature_2m),
        feelsLike: Math.round(data?.current?.apparent_temperature),
        humidity: data?.current?.relative_humidity_2m,
        windSpeed: Math.round(data?.current?.wind_speed_10m),
        precipitation: data?.current?.precipitation,
        weatherCode: data?.current?.weather_code,
        pressure: Math.round(data?.current?.pressure_msl),
        visibility: Math.round(data?.current?.visibility / 1000),
        maxTemp: Math.round(data?.daily?.temperature_2m_max[0]),
        minTemp: Math.round(data?.daily?.temperature_2m_min[0]),
      };

      if (isCurrent) {
        setCurrentWeather(weatherData);
      }

      return weatherData;
    } catch (err) {
      console.error("Error fetching weather:", err);
      return null;
    }
  };

    const removeFromFavorites = (index) => {
    const newFavorites = favorites.filter((_, i) => i !== index);
    saveFavorites(newFavorites);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-lg">Loading weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white w-full">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🌤️</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Weather Now
              </h1>
            </div>

            <button
              onClick={() => setShowSearch(!showSearch)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all duration-200 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Add City</span>
            </button>
          </div>
        </div>
      </header>

      <SearchCities favorites={favorites} setFavorites={setFavorites} showSearch={showSearch} setShowSearch={setShowSearch}/>

      <main className="px-4 sm:px-6 lg:px-8 py-8 space-y-5">
      <div className="flex md:flex-row flex-col gap-10 justify-between">
      <div className="flex flex-col gap-3 md:w-4/6">
        {currentWeather && (
          <WeatherCard
            weatherCode={currentWeather.weatherCode}
            name={currentWeather.name}
            temperature={currentWeather.temperature}
            windSpeed={currentWeather.windSpeed}
            humidity={currentWeather.humidity}
            visibility={currentWeather.visibility}
            pressure={currentWeather.pressure}
            feelsLike={currentWeather.feelsLike}
            maxTemp={currentWeather.maxTemp}
            minTemp={currentWeather.minTemp}
          />
        )}
      </div>
      <div className="md:w-2/6">
        <PopularCities />
      </div>
      </div>
      <FavouriteCities favorites={favorites} removeFromFavorites={removeFromFavorites}/>
      </main>
    </div>
  );
};

export default WeatherApp;