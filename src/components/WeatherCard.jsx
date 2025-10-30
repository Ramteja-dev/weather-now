import {
  Droplets,
  Eye,
  Gauge,
  MapPin,
  Wind,
  ThermometerSun,
  ThermometerSnowflake
} from "lucide-react";
import { getGradient, getWeatherDescription, getWeatherEmoji } from "./utils";

export default function WeatherCard({
  weatherDescription,
  name,
  weatherCode,
  temperature,
  windSpeed,
  humidity,
  visibility,
  pressure,
  feelsLike,
  maxTemp,
  minTemp,
  onClick
}) {
  return (
    <div
      onClick={() => { onClick() }}
      className={`rounded-3xl p-8 py-12 w-full ${getGradient(
        weatherCode
      )} shadow-2xl bg-slate-900 hover:cursor-pointer`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-white/80 mb-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">Current Location</span>
          </div>
          {name && <h2 className="text-3xl md:text-4xl font-bold mb-1 text-start">{name}</h2>}
          <p className="text-white/90 text-lg text-start mt-2">
            {getWeatherDescription(weatherCode)}
          </p>
        </div>
        <div className="text-7xl">{getWeatherEmoji(weatherCode)}</div>
      </div>

      <div className="flex items-end gap-2 mb-8">
        <div className="text-7xl font-bold">{temperature}°</div>
        <div className="text-3xl font-light mb-3 opacity-80">C</div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center gap-2 text-white/70 mb-2">
            <Wind className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wide">Wind</span>
          </div>
          <div className="text-2xl font-semibold">{windSpeed} km/h</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center gap-2 text-white/70 mb-2">
            <Droplets className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wide">Humidity</span>
          </div>
          <div className="text-2xl font-semibold">{humidity}%</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center gap-2 text-white/70 mb-2">
            <Eye className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wide">Visibility</span>
          </div>
          <div className="text-2xl font-semibold">{visibility} km</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center gap-2 text-white/70 mb-2">
            <Gauge className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wide">Pressure</span>
          </div>
          <div className="text-2xl font-semibold">{pressure} hPa</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center gap-2 text-white/70 mb-2">
            <ThermometerSun className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wide">High</span>
          </div>
          <div className="text-2xl font-semibold">{maxTemp}°</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center gap-2 text-white/70 mb-2">
            <ThermometerSnowflake className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wide">Low</span>
          </div>
          <div className="text-2xl font-semibold">{minTemp}°</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center gap-2 text-white/70 mb-2">
            <ThermometerSnowflake className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wide">Feels Like</span>
          </div>
          <div className="text-2xl font-semibold">{feelsLike}°</div>
        </div>
      </div>

    </div>
  );
}
