import {
  Activity,
  CloudRain,
  Droplets,
  Eye,
  Gauge,
  Loader2,
  Moon,
  Sun,
  Thermometer,
  Wind,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

// Detailed Weather Modal Component
export const WeatherDetailModal = ({ isOpen, onClose, lat, lon, name }) => {
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
      console.log("WeatherDetailModal opened with cords:", lat, lon, name);
      console.log("lat", lat)
    if (isOpen && lat && lon) {
      fetchDetailedWeather();
    }
  }, [isOpen, lat, lon]);

  const fetchDetailedWeather = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,surface_pressure,cloud_cover,visibility,uv_index&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto&forecast_days=7`
      );
      const data = await response.json();
      setDetailData(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching detailed weather:", err);
      setLoading(false);
    }
  };

  const getWindDirection = (degrees) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  const getUVLevel = (uv) => {
    if (uv <= 2) return { level: "Low", color: "text-green-400" };
    if (uv <= 5) return { level: "Moderate", color: "text-yellow-400" };
    if (uv <= 7) return { level: "High", color: "text-orange-400" };
    if (uv <= 10) return { level: "Very High", color: "text-red-400" };
    return { level: "Extreme", color: "text-purple-400" };
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const getWeatherEmoji = (code) => {
    if (code === 0) return "☀️";
    if (code <= 3) return "⛅";
    if (code <= 67) return "🌧️";
    if (code <= 77) return "❄️";
    return "☁️";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-6xl border border-slate-800 my-8">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-1 text-start capitalize">{name}</h2>
            <p className="text-slate-400 text-start">Detailed Weather Report</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Loading detailed weather data...</p>
          </div>
        ) : detailData ? (
          <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Current Conditions Grid */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                Current Conditions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Thermometer className="w-4 h-4" />
                    <span className="text-sm">Temperature</span>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {Math.round(detailData.current.temperature_2m)}°C
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Feels like{" "}
                    {Math.round(detailData.current.apparent_temperature)}°C
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Wind className="w-4 h-4" />
                    <span className="text-sm">Wind</span>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {Math.round(detailData.current.wind_speed_10m)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    km/h{" "}
                    {getWindDirection(detailData.current.wind_direction_10m)}
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Droplets className="w-4 h-4" />
                    <span className="text-sm">Humidity</span>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {detailData.current.relative_humidity_2m}%
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Relative humidity
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">Visibility</span>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {Math.round(detailData.current.visibility / 1000)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">kilometers</div>
                </div>

                <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Gauge className="w-4 h-4" />
                    <span className="text-sm">Pressure</span>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {Math.round(detailData.current.pressure_msl)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    hPa at sea level
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Sun className="w-4 h-4" />
                    <span className="text-sm">UV Index</span>
                  </div>
                  <div
                    className={`text-3xl font-bold ${
                      getUVLevel(detailData.current.uv_index).color
                    }`}
                  >
                    {Math.round(detailData.current.uv_index)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {getUVLevel(detailData.current.uv_index).level}
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <CloudRain className="w-4 h-4" />
                    <span className="text-sm">Cloud Cover</span>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {detailData.current.cloud_cover}%
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Sky coverage
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <CloudRain className="w-4 h-4" />
                    <span className="text-sm">Precipitation</span>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {detailData.current.precipitation}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    mm currently
                  </div>
                </div>
              </div>
            </div>

            {/* Sun Times */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Sun className="w-5 h-5 text-yellow-400" />
                Sun & Moon
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-2xl p-6 border border-orange-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-orange-200 mb-1">
                        Sunrise
                      </div>
                      <div className="text-3xl font-bold text-white">
                        {formatTime(detailData.daily.sunrise[0])}
                      </div>
                    </div>
                    <Sun className="w-12 h-12 text-orange-400" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl p-6 border border-indigo-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-indigo-200 mb-1">Sunset</div>
                      <div className="text-3xl font-bold text-white">
                        {formatTime(detailData.daily.sunset[0])}
                      </div>
                    </div>
                    <Moon className="w-12 h-12 text-indigo-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Hourly Forecast */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                24-Hour Forecast
              </h3>
              <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700 overflow-x-auto">
                <div className="flex gap-4 min-w-max">
                  {detailData.hourly.time.slice(0, 24).map((time, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center gap-2 min-w-[80px]"
                    >
                      <div className="text-sm text-slate-400">
                        {new Date(time).getHours() === 0
                          ? "12 AM"
                          : new Date(time).getHours() < 12
                          ? `${new Date(time).getHours()} AM`
                          : new Date(time).getHours() === 12
                          ? "12 PM"
                          : `${new Date(time).getHours() - 12} PM`}
                      </div>
                      <div className="text-2xl">
                        {getWeatherEmoji(detailData.hourly.weather_code[idx])}
                      </div>
                      <div className="text-lg font-semibold text-white">
                        {Math.round(detailData.hourly.temperature_2m[idx])}°
                      </div>
                      <div className="flex items-center gap-1 text-xs text-blue-400">
                        <Droplets className="w-3 h-3" />
                        {detailData.hourly.precipitation_probability[idx]}%
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Wind className="w-3 h-3" />
                        {Math.round(detailData.hourly.wind_speed_10m[idx])}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 7-Day Forecast */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                7-Day Forecast
              </h3>
              <div className="space-y-3">
                {detailData.daily.time.map((date, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700 hover:border-slate-600 transition-colors"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-center">
                      <div className="font-semibold text-white">
                        {getDayName(date)}
                        <div className="text-xs text-slate-400 mt-1">
                          {new Date(date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-3xl">
                          {getWeatherEmoji(detailData.daily.weather_code[idx])}
                        </span>
                      </div>

                      <div className="text-center">
                        <div className="text-sm text-slate-400 mb-1">
                          High / Low
                        </div>
                        <div className="text-lg font-semibold text-white">
                          {Math.round(detailData.daily.temperature_2m_max[idx])}
                          ° /{" "}
                          {Math.round(detailData.daily.temperature_2m_min[idx])}
                          °
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-sm text-slate-400 mb-1">Rain</div>
                        <div className="flex items-center justify-center gap-1 text-blue-400">
                          <Droplets className="w-4 h-4" />
                          <span className="font-semibold">
                            {
                              detailData.daily.precipitation_probability_max[
                                idx
                              ]
                            }
                            %
                          </span>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-sm text-slate-400 mb-1">Wind</div>
                        <div className="flex items-center justify-center gap-1">
                          <Wind className="w-4 h-4 text-slate-400" />
                          <span className="font-semibold text-white">
                            {Math.round(
                              detailData.daily.wind_speed_10m_max[idx]
                            )}{" "}
                            km/h
                          </span>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-sm text-slate-400 mb-1">
                          UV Index
                        </div>
                        <div
                          className={`font-semibold ${
                            getUVLevel(detailData.daily.uv_index_max[idx]).color
                          }`}
                        >
                          {Math.round(detailData.daily.uv_index_max[idx])} -{" "}
                          {getUVLevel(detailData.daily.uv_index_max[idx]).level}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-slate-400">Failed to load weather data</p>
          </div>
        )}
      </div>
    </div>
  );
};
