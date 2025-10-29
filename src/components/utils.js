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