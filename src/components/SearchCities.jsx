import React, { useEffect, useState } from "react";
import { X, Search, Loader2 } from "lucide-react";
import { fetchWeather } from "./utils";

export default function SearchCities({
  favorites,
  setFavorites,
  showSearch,
  setShowSearch,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) searchCity(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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
    console.log("selected city", city);
    const isDuplicate = favorites.some(
      (fav) => fav.lat === city.latitude && fav.lon === city.longitude
    );

    if (isDuplicate) {
      setSearchQuery("");
      setSearchResults([]);
      setShowSearch(false);
      return;
    }

    const newFavorites = [
      ...favorites,
      {
        lat: city?.latitude,
        log: city?.longitude,
        name: `${city.name}, ${city.country}`,
      },
    ];
    saveFavorites(newFavorites);
    setSearchQuery("");
    setSearchResults([]);
    setShowSearch(false);
  };

  const isFavorite = (lat, lon) => {
    return favorites.some((fav) => fav.lat === lat && fav.lon === lon);
  };

  const saveFavorites = (favs) => {
    localStorage.setItem("weatherFavorites", JSON.stringify(favs));
    setFavorites(favs);
  };
  return (
    <>
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
    </>
  );
}
