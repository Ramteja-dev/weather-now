import React from "react";

export default function SearchCities() {
  return (
    <div>
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
                          <span className="text-sm text-slate-500">Added</span>
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
    </div>
  );
}
