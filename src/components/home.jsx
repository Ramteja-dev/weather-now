import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Heart,
  Wind,
  Droplets,
  Eye,
  Gauge,
  X,
  Loader2,
} from "lucide-react";
import WeatherCard from "./WeatherCard";

const WeatherApp = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadFavorites();
    getCurrentLocationWeather();
  }, []);

  const loadFavorites = () => {
    const saved = localStorage.getItem("weatherFavorites");
    if (saved) {
      const favs = JSON.parse(saved);
      favs.forEach((fav, idx) => {
        fetchWeather(fav.lat, fav.lon, fav.name).then((updated) => {
          setFavorites((prev) => {
            const newFavs = [...prev];
            newFavs[idx] = updated;
            return newFavs;
          });
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
        temperature: Math.round(data.current.temperature_2m),
        feelsLike: Math.round(data.current.apparent_temperature),
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        precipitation: data.current.precipitation,
        weatherCode: data.current.weather_code,
        pressure: Math.round(data.current.pressure_msl),
        visibility: Math.round(data.current.visibility / 1000),
        maxTemp: Math.round(data.daily.temperature_2m_max[0]),
        minTemp: Math.round(data.daily.temperature_2m_min[0]),
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

  const searchCity = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          query
        )}&count=8&language=en&format=json`
      );
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error("Error searching city:", err);
    }
    setSearching(false);
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

  const removeFromFavorites = (index) => {
    const newFavorites = favorites.filter((_, i) => i !== index);
    saveFavorites(newFavorites);
  };

  const isFavorite = (lat, lon) => {
    return favorites.some((fav) => fav.lat === lat && fav.lon === lon);
  };

  const getWeatherEmoji = (code) => {
    if (code === 0) return "☀️";
    if (code <= 3) return "⛅";
    if (code <= 67) return "🌧️";
    if (code <= 77) return "❄️";
    return "☁️";
  };

  const getWeatherDescription = (code) => {
    if (code === 0) return "Clear";
    if (code <= 3) return "Partly Cloudy";
    if (code <= 67) return "Rain";
    if (code <= 77) return "Snow";
    return "Cloudy";
  };

  const getGradient = (code) => {
    if (code === 0) return "from-amber-400 to-orange-500";
    if (code <= 3) return "from-blue-400 to-blue-600";
    if (code <= 67) return "from-slate-600 to-slate-800";
    return "from-gray-400 to-gray-600";
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) searchCity(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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
                Weather
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

      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4">
          <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-800">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Add City</h2>
                <button
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for a city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400"
                  autoFocus
                />
              </div>

              {searching && (
                <div className="mt-4 text-center text-slate-400 py-8">
                  <Loader2 className="w-6 h-6 animate-spin inline-block" />
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
                  {searchResults.map((city, idx) => {
                    const alreadyAdded = isFavorite(
                      city.latitude,
                      city.longitude
                    );
                    return (
                      <button
                        key={idx}
                        onClick={() => !alreadyAdded && addToFavorites(city)}
                        disabled={alreadyAdded}
                        className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                          alreadyAdded
                            ? "bg-slate-800/50 cursor-not-allowed opacity-50"
                            : "bg-slate-800 hover:bg-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-lg">
                              {city.name}
                            </div>
                            <div className="text-sm text-slate-400">
                              {city.admin1 && `${city.admin1}, `}
                              {city.country}
                            </div>
                          </div>
                          {alreadyAdded && (
                            <span className="text-sm text-slate-500">
                              Added
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Location Weather */}
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

        {/* Favorites Section */}
        {favorites.length > 0 && (
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
                    <span className="text-5xl font-bold">
                      {fav.temperature}°
                    </span>
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
        )}

        {favorites.length === 0 && currentWeather && (
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
        )}
      </main>
    </div>
  );
};

export default WeatherApp;

// "use client"

// import { useState, useEffect } from "react"
// import { Heart } from "lucide-react"
// import CurrentWeather from "./CurrentWeather"
// import FavoritesCities from "./FavoritesCities"
// import SearchCities from "./search-cities"

// export default function Home() {
//   const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null)
//   const [currentCity, setCurrentCity] = useState<City | null>(null)
//   const [favorites, setFavorites] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   // Load favorites from localStorage
//   useEffect(() => {
//     const saved = localStorage.getItem("favoritesCities")
//     if (saved) {
//       setFavorites(JSON.parse(saved))
//     }
//   }, [])

//   // Fetch weather for current location
//   useEffect(() => {
//     const getLocationAndWeather = async () => {
//       try {
//         setLoading(true)
//         setError(null)

//         // Get user's current location
//         const position = await new Promise<GeolocationCoordinates>((resolve, reject) => {
//           navigator.geolocation.getCurrentPosition(
//             (pos) => resolve(pos.coords),
//             (err) => reject(err),
//           )
//         })

//         // Fetch weather data
//         const response = await fetch(
//           `https://api.open-meteo.com/v1/forecast?latitude=${position.latitude}&longitude=${position.longitude}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m,visibility,pressure_msl&timezone=auto`,
//         )

//         if (!response.ok) throw new Error("Failed to fetch weather")

//         const data = await response.json()
//         setCurrentWeather(data)
//         setCurrentCity({
//           name: "Current Location",
//           latitude: position.latitude,
//           longitude: position.longitude,
//         })
//       } catch (err) {
//         setError("Unable to get your location. Please enable location services.")
//         console.error(err)
//       } finally {
//         setLoading(false)
//       }
//     }

//     getLocationAndWeather()
//   }, [])

//   const addToFavorites = (city) => {
//     const exists = favorites.some((fav) => fav.latitude === city.latitude && fav.longitude === city.longitude)
//     if (!exists) {
//       const updated = [...favorites, city]
//       setFavorites(updated)
//       localStorage.setItem("favoritesCities", JSON.stringify(updated))
//     }
//   }

//   const removeFromFavorites = (city) => {
//     const updated = favorites.filter((fav) => !(fav.latitude === city.latitude && fav.longitude === city.longitude))
//     setFavorites(updated)
//     localStorage.setItem("favoritesCities", JSON.stringify(updated))
//   }

//   const isFavorite = (city) => {
//     return favorites.some((fav) => fav.latitude === city.latitude && fav.longitude === city.longitude)
//   }

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-blue-900 dark:to-slate-900">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Weather</h1>
//           <p className="text-slate-600 dark:text-slate-400">Check weather for your favorite cities</p>
//         </div>

//         {/* Search Bar */}
//         <div className="mb-8">
//           <SearchCities onSelectCity={addToFavorites} />
//         </div>

//         {/* Current Weather */}
//         {loading ? (
//           <div className="flex items-center justify-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//           </div>
//         ) : error ? (
//           <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
//             <p className="text-red-700 dark:text-red-400">{error}</p>
//           </div>
//         ) : currentWeather && currentCity ? (
//           <div className="mb-8">
//             <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Current Location</h2>
//             <CurrentWeather
//               weather={currentWeather}
//               city={currentCity}
//               isFavorite={isFavorite(currentCity)}
//               onToggleFavorite={() =>
//                 isFavorite(currentCity) ? removeFromFavorites(currentCity) : addToFavorites(currentCity)
//               }
//             />
//           </div>
//         ) : null}

//         {/* Favorites */}
//         {favorites.length > 0 && (
//           <div>
//             <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Favorite Cities</h2>
//             <FavoritesCities cities={favorites} onRemove={removeFromFavorites} />
//           </div>
//         )}

//         {favorites.length === 0 && !loading && (
//           <div className="text-center py-12">
//             <Heart className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
//             <p className="text-slate-600 dark:text-slate-400">No favorite cities yet. Search and add one!</p>
//           </div>
//         )}
//       </div>
//     </main>
//   )
// }
